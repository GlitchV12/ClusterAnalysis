import type { Dataset } from '../../../types/dataset';
import type { KMeansResult } from '../../clustering/services/kmeans.service';
import { PreprocessingService } from '../../clustering/services/preprocessing.service';
import type { ImputationStrategy, ScalingStrategy } from '../../../state/prepare.store';
import { PCA } from 'ml-pca';

export interface ClusterProfile {
  id: number;
  size: number;
  averages: Record<string, number>;
  importanceScores: Record<string, number>;
}

export class InterpretationService {
  /**
   * Calculates the average unscaled values for each cluster to make them interpretable.
   */
  static generateProfiles(
    dataset: Dataset,
    selectedFeatures: string[],
    imputationStrategy: ImputationStrategy,
    outlierStrategy: OutlierStrategy,
    clusteringResult: KMeansResult
  ): { profiles: ClusterProfile[], featureNames: string[] } {
    
    // 1. Get the imputed but UNSCALED data to calculate real-world averages
    const { matrix: unscaledMatrix, featureNames } = PreprocessingService.processData(
      dataset,
      selectedFeatures,
      imputationStrategy,
      'none', // Force no scaling for interpretation
      outlierStrategy
    );

    const numClusters = clusteringResult.clusterCenters.length;
    const assignments = clusteringResult.clusterAssignments;

    // Initialize profiles
    const profiles: ClusterProfile[] = Array.from({ length: numClusters }, (_, i) => ({
      id: i,
      size: 0,
      averages: {},
      importanceScores: {}
    }));

    const sums: Record<number, Record<string, number>> = {};
    for (let i = 0; i < numClusters; i++) {
      sums[i] = {};
      featureNames.forEach(f => sums[i][f] = 0);
    }

    // Accumulate sums and sizes
    for (let rowIdx = 0; rowIdx < unscaledMatrix.length; rowIdx++) {
      const clusterId = assignments[rowIdx];
      const row = unscaledMatrix[rowIdx];

      profiles[clusterId].size++;
      
      for (let colIdx = 0; colIdx < featureNames.length; colIdx++) {
        sums[clusterId][featureNames[colIdx]] += row[colIdx];
      }
    }

    // Calculate overall dataset statistics for Feature Importance
    const overallMeans: Record<string, number> = {};
    const overallStdDevs: Record<string, number> = {};
    const numRows = unscaledMatrix.length;

    featureNames.forEach((f, colIdx) => {
      let sum = 0;
      for (let r = 0; r < numRows; r++) {
        sum += unscaledMatrix[r][colIdx];
      }
      overallMeans[f] = numRows > 0 ? sum / numRows : 0;
      
      let sumSq = 0;
      for (let r = 0; r < numRows; r++) {
        sumSq += Math.pow(unscaledMatrix[r][colIdx] - overallMeans[f], 2);
      }
      overallStdDevs[f] = Math.sqrt(sumSq / numRows) || 1; // avoid division by zero
    });

    // Calculate cluster averages and importance scores
    for (let i = 0; i < numClusters; i++) {
      const size = profiles[i].size;
      featureNames.forEach(f => {
        const avg = size > 0 ? sums[i][f] / size : 0;
        profiles[i].averages[f] = avg;
        profiles[i].importanceScores[f] = (avg - overallMeans[f]) / overallStdDevs[f];
      });
    }

    return { profiles, featureNames };
  }

  /**
   * Generates data points for a 2D scatter plot given two raw feature indices.
   */
  static getScatterData(
    dataset: Dataset,
    selectedFeatures: string[],
    imputationStrategy: ImputationStrategy,
    outlierStrategy: OutlierStrategy,
    assignments: number[],
    xFeatureName: string,
    yFeatureName: string
  ): { x: number; y: number; cluster: number }[] {
    
    const { matrix: unscaledMatrix, featureNames } = PreprocessingService.processData(
      dataset,
      selectedFeatures,
      imputationStrategy,
      'none',
      outlierStrategy
    );

    const xIdx = featureNames.indexOf(xFeatureName);
    const yIdx = featureNames.indexOf(yFeatureName);

    if (xIdx === -1 || yIdx === -1) return [];

    return unscaledMatrix.map((row, index) => ({
      x: row[xIdx],
      y: row[yIdx],
      cluster: assignments[index]
    }));
  }

  /**
   * Generates True 2D Projection using PCA on the SCALED data.
   */
  static getPCAData(
    dataset: Dataset,
    selectedFeatures: string[],
    imputationStrategy: ImputationStrategy,
    scalingStrategy: ScalingStrategy,
    outlierStrategy: OutlierStrategy,
    assignments: number[]
  ): { x: number; y: number; cluster: number }[] {
    
    // PCA must be run on the scaled data so variables with large ranges don't dominate
    const { matrix: scaledMatrix } = PreprocessingService.processData(
      dataset,
      selectedFeatures,
      imputationStrategy,
      scalingStrategy,
      outlierStrategy
    );

    if (scaledMatrix.length === 0 || scaledMatrix[0].length < 2) {
      return [];
    }

    // Initialize PCA
    const pca = new PCA(scaledMatrix);
    
    // Project dataset into the first 2 principal components
    const projected = pca.predict(scaledMatrix, { nComponents: 2 }).to2DArray();

    return projected.map((row, index) => ({
      x: row[0], // PC1
      y: row[1], // PC2
      cluster: assignments[index]
    }));
  }
}
