import type { Dataset } from '../../../types/dataset';
import type { ImputationStrategy, ScalingStrategy, OutlierStrategy } from '../../../state/prepare.store';

export class PreprocessingService {
  /**
   * Preprocesses the dataset based on selected features, imputation strategy, and scaling strategy.
   * Returns a 2D array of numbers ready for clustering, and an array of the original row indices 
   * that were kept (in case rows were dropped).
   */
  static processData(
    dataset: Dataset,
    selectedFeatures: string[],
    imputationStrategy: ImputationStrategy,
    scalingStrategy: ScalingStrategy,
    outlierStrategy: OutlierStrategy = 'none'
  ): { matrix: number[][], originalIndices: number[], featureNames: string[] } {
    
    // 1. Filter dataset rows to only include selected features and handle imputation
    let { matrix: currentMatrix, originalIndices, featureNames } = this.imputeData(dataset, selectedFeatures, imputationStrategy);
    
    if (currentMatrix.length === 0) {
      throw new Error("No data left after preprocessing. Check your missing value strategy.");
    }

    // 2. Remove Outliers (if configured)
    if (outlierStrategy === 'zscore') {
      const filtered = this.removeOutliersZScore(currentMatrix, originalIndices);
      currentMatrix = filtered.matrix;
      originalIndices = filtered.originalIndices;
    }

    if (currentMatrix.length === 0) {
      throw new Error("All data was removed during outlier filtering.");
    }

    // 3. Scale the data
    let finalMatrix = currentMatrix;
    if (scalingStrategy === 'standard') {
      finalMatrix = this.standardScale(currentMatrix);
    } else if (scalingStrategy === 'minmax') {
      finalMatrix = this.minMaxScale(currentMatrix);
    }

    return { matrix: finalMatrix, originalIndices, featureNames };
  }

  private static removeOutliersZScore(matrix: number[][], originalIndices: number[]): { matrix: number[][], originalIndices: number[] } {
    if (matrix.length === 0) return { matrix, originalIndices };
    
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    
    const means = new Array(numCols).fill(0);
    const stdDevs = new Array(numCols).fill(0);

    // Calculate means
    for (let c = 0; c < numCols; c++) {
      let sum = 0;
      for (let r = 0; r < numRows; r++) {
        sum += matrix[r][c];
      }
      means[c] = sum / numRows;
    }

    // Calculate std devs
    for (let c = 0; c < numCols; c++) {
      let sumSq = 0;
      for (let r = 0; r < numRows; r++) {
        sumSq += Math.pow(matrix[r][c] - means[c], 2);
      }
      stdDevs[c] = Math.sqrt(sumSq / numRows) || 1;
    }

    const filteredMatrix: number[][] = [];
    const filteredIndices: number[] = [];

    // Filter rows where ANY feature has |z-score| > 3
    for (let r = 0; r < numRows; r++) {
      let isOutlier = false;
      for (let c = 0; c < numCols; c++) {
        const zScore = Math.abs((matrix[r][c] - means[c]) / stdDevs[c]);
        if (zScore > 3) {
          isOutlier = true;
          break;
        }
      }
      if (!isOutlier) {
        filteredMatrix.push(matrix[r]);
        filteredIndices.push(originalIndices[r]);
      }
    }

    return { matrix: filteredMatrix, originalIndices: filteredIndices };
  }

  private static imputeData(dataset: Dataset, selectedFeatures: string[], strategy: ImputationStrategy) {
    const originalIndices: number[] = [];
    const selectedCols = dataset.columns.filter(c => selectedFeatures.includes(c.id));
    
    const columnMeta: Array<{
      colName: string;
      type: 'numeric' | 'categorical';
      uniqueValues?: string[];
    }> = [];
    
    const featureNames: string[] = [];

    // Analyze selected columns for OHE
    for (const col of selectedCols) {
      if (col.detectedType === 'categorical' && col.uniqueCount <= 10) {
        const uniqueVals = new Set<string>();
        for (const row of dataset.data) {
          const val = row[col.name];
          if (val !== null && val !== undefined && val !== '') {
            uniqueVals.add(String(val).trim());
          }
        }
        const vals = Array.from(uniqueVals).sort();
        columnMeta.push({ colName: col.name, type: 'categorical', uniqueValues: vals });
        for (const v of vals) {
          featureNames.push(`${col.name}_${v}`);
        }
      } else {
        columnMeta.push({ colName: col.name, type: 'numeric' });
        featureNames.push(col.name);
      }
    }
    
    let matrix: number[][] = [];

    // Calculate column means/modes if needed for numeric columns
    const columnMeans = new Map<string, number>();
    if (strategy === 'mean') {
      for (const meta of columnMeta) {
        if (meta.type === 'numeric') {
          let sum = 0;
          let count = 0;
          for (const row of dataset.data) {
            const val = Number(row[meta.colName]);
            if (!isNaN(val) && row[meta.colName] !== null && row[meta.colName] !== '') {
              sum += val;
              count++;
            }
          }
          columnMeans.set(meta.colName, count > 0 ? sum / count : 0);
        }
      }
    }

    for (let i = 0; i < dataset.data.length; i++) {
      const row = dataset.data[i];
      const newRow: number[] = [];
      let hasMissing = false;

      for (const meta of columnMeta) {
        const rawVal = row[meta.colName];

        if (meta.type === 'categorical') {
          const val = rawVal !== null && rawVal !== undefined ? String(rawVal).trim() : '';
          
          if (!val) {
            if (strategy === 'drop') {
              hasMissing = true;
              break;
            } else {
              // For zero/mean strategy on categorical, we just emit all zeros (meaning "Unknown")
              for (let j = 0; j < meta.uniqueValues!.length; j++) {
                newRow.push(0);
              }
            }
          } else {
            for (const uVal of meta.uniqueValues!) {
              newRow.push(val === uVal ? 1 : 0);
            }
          }
        } else {
          // Numeric handling
          let val = Number(rawVal);
          if (isNaN(val) || rawVal === null || rawVal === '') {
            if (strategy === 'drop') {
              hasMissing = true;
              break;
            } else if (strategy === 'mean') {
              val = columnMeans.get(meta.colName) || 0;
            } else if (strategy === 'zero') {
              val = 0;
            }
          }
          newRow.push(val);
        }
      }

      if (!hasMissing) {
        matrix.push(newRow);
        originalIndices.push(i);
      }
    }

    return { matrix, originalIndices, featureNames };
  }

  private static standardScale(matrix: number[][]): number[][] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    
    const means = new Array(numCols).fill(0);
    const stdDevs = new Array(numCols).fill(0);

    // Calculate means
    for (let c = 0; c < numCols; c++) {
      let sum = 0;
      for (let r = 0; r < numRows; r++) {
        sum += matrix[r][c];
      }
      means[c] = sum / numRows;
    }

    // Calculate std devs
    for (let c = 0; c < numCols; c++) {
      let sumSq = 0;
      for (let r = 0; r < numRows; r++) {
        sumSq += Math.pow(matrix[r][c] - means[c], 2);
      }
      stdDevs[c] = Math.sqrt(sumSq / numRows) || 1; // prevent division by zero
    }

    // Scale
    return matrix.map(row => 
      row.map((val, c) => (val - means[c]) / stdDevs[c])
    );
  }

  private static minMaxScale(matrix: number[][]): number[][] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    
    const mins = new Array(numCols).fill(Infinity);
    const maxs = new Array(numCols).fill(-Infinity);

    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < numRows; r++) {
        if (matrix[r][c] < mins[c]) mins[c] = matrix[r][c];
        if (matrix[r][c] > maxs[c]) maxs[c] = matrix[r][c];
      }
    }

    return matrix.map(row => 
      row.map((val, c) => {
        const range = maxs[c] - mins[c];
        return range === 0 ? 0 : (val - mins[c]) / range;
      })
    );
  }
}
