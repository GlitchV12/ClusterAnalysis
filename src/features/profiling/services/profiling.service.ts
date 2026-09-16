import type { Dataset, DatasetColumn, VariableType } from '../../../types/dataset';

export interface DatasetQuality {
  totalMissingPercent: number;
  duplicateRowsPercent: number;
}

export class ProfilingService {
  /**
   * Profiles the dataset columns to detect variable types and compute column-level metrics.
   */
  static profileDataset(dataset: Dataset): { columns: DatasetColumn[], quality: DatasetQuality } {
    const data = dataset.data;
    const rowCount = data.length;

    // Detect duplicates based on stringified row values
    const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
    const duplicateRowsPercent = rowCount > 0 ? ((rowCount - uniqueRows.size) / rowCount) * 100 : 0;

    let totalMissing = 0;
    let totalCells = rowCount * dataset.columns.length;

    const profiledColumns: DatasetColumn[] = dataset.columns.map(col => {
      let missingCount = 0;
      const uniqueValues = new Set();
      let numericCount = 0;
      let stringCount = 0;

      for (const row of data) {
        const val = row[col.name];
        
        if (val === null || val === undefined || val === '') {
          missingCount++;
          continue;
        }

        uniqueValues.add(val);

        if (typeof val === 'number') {
          numericCount++;
        } else if (typeof val === 'string' && !isNaN(Number(val))) {
          numericCount++;
        } else if (typeof val === 'string') {
          stringCount++;
        }
      }

      totalMissing += missingCount;
      const uniqueCount = uniqueValues.size;
      const validCount = rowCount - missingCount;

      let detectedType: VariableType = 'unknown';

      if (validCount > 0) {
        if (uniqueCount === validCount && stringCount > 0) {
          detectedType = 'identifier';
        } else if (numericCount === validCount) {
          // If all valid values are numeric
          // Check if it's ordinal/categorical disguised as numeric (e.g. 1, 2, 3)
          if (uniqueCount <= 10 && rowCount > 20) {
            // Very low cardinality numeric could be categorical, but let's default to numeric for now unless strictly needed
            // The user can override. We will assume numeric.
            detectedType = 'numeric';
          } else {
            detectedType = 'numeric';
          }
        } else if (stringCount > 0) {
          // It's text/categorical
          if (uniqueCount / validCount > 0.9 && validCount > 100) {
            detectedType = 'text'; // High cardinality string -> text
          } else {
            detectedType = 'categorical'; // Low/medium cardinality -> categorical
          }
        }
      }

      return {
        ...col,
        missingCount,
        uniqueCount,
        detectedType
      };
    });

    const totalMissingPercent = totalCells > 0 ? (totalMissing / totalCells) * 100 : 0;

    return {
      columns: profiledColumns,
      quality: {
        totalMissingPercent,
        duplicateRowsPercent
      }
    };
  }
}
