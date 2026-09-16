import { MetricsService } from './metrics.service';
import { seededRandom } from '../../../utils/random';

export interface KMeansResult {
  clusterCenters: number[][];
  clusterAssignments: number[]; // Maps row index to cluster ID
  wcss: number; // Within-Cluster Sum of Squares
  silhouetteScore: number;
  iterations: number;
}

export class KMeansService {
  /**
   * Generates the Evaluation Curve data by running K-Means for K=1 to maxK.
   */
  static generateElbowCurve(data: number[][], maxK: number = 10): { k: number; wcss: number; silhouetteScore: number }[] {
    const curve = [];
    const actualMaxK = Math.min(maxK, data.length); // Cannot have more clusters than data points

    for (let k = 1; k <= actualMaxK; k++) {
      const result = this.runKMeans(data, k, 20); // Faster iteration limit for elbow calculation
      curve.push({ k, wcss: result.wcss, silhouetteScore: result.silhouetteScore });
    }
    
    return curve;
  }

  /**
   * Runs the K-Means clustering algorithm.
   */
  static runKMeans(data: number[][], k: number, maxIterations: number = 100): KMeansResult {
    const numRows = data.length;
    const numCols = data[0].length;

    if (numRows === 0 || k === 0) {
      throw new Error("Invalid data or K for clustering.");
    }

    // 1. Initialize centroids randomly using K-Means++ logic (simplified to random picking for now)
    // We use a fixed seed based on K so it's deterministic but explores different spaces for different K
    const random = seededRandom(42 + k);
    let centroids = this.initializeCentroids(data, k, random);
    let assignments = new Array(numRows).fill(-1);
    let iterations = 0;
    let hasChanged = true;

    // 2. Iterate
    while (hasChanged && iterations < maxIterations) {
      hasChanged = false;
      
      // Step A: Assign clusters
      for (let i = 0; i < numRows; i++) {
        let minDist = Infinity;
        let bestCluster = -1;

        for (let j = 0; j < k; j++) {
          const dist = this.euclideanDistance(data[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            bestCluster = j;
          }
        }

        if (assignments[i] !== bestCluster) {
          assignments[i] = bestCluster;
          hasChanged = true;
        }
      }

      // Step B: Update centroids
      const newCentroids = Array.from({ length: k }, () => new Array(numCols).fill(0));
      const counts = new Array(k).fill(0);

      for (let i = 0; i < numRows; i++) {
        const cluster = assignments[i];
        for (let c = 0; c < numCols; c++) {
          newCentroids[cluster][c] += data[i][c];
        }
        counts[cluster]++;
      }

      for (let j = 0; j < k; j++) {
        if (counts[j] > 0) {
          for (let c = 0; c < numCols; c++) {
            newCentroids[j][c] /= counts[j];
          }
        } else {
          // If a cluster becomes empty, re-initialize it randomly to prevent NaNs
          const randomIdx = Math.floor(random() * numRows);
          newCentroids[j] = [...data[randomIdx]];
        }
      }

      centroids = newCentroids;
      iterations++;
    }

    // 3. Calculate final WCSS
    let wcss = 0;
    for (let i = 0; i < numRows; i++) {
      const cluster = assignments[i];
      const dist = this.euclideanDistance(data[i], centroids[cluster]);
      wcss += dist * dist; // Squared distance
    }

    // 4. Calculate Silhouette Score (undefined/0 for K=1)
    const silhouetteScore = k > 1 
      ? MetricsService.calculateSilhouetteScore(data, assignments)
      : 0;

    return {
      clusterCenters: centroids,
      clusterAssignments: assignments,
      wcss,
      silhouetteScore,
      iterations
    };
  }

  private static initializeCentroids(data: number[][], k: number, randomFn: () => number): number[][] {
    // Simple random sample from data without replacement
    const numRows = data.length;
    const indices = new Set<number>();
    
    while (indices.size < k && indices.size < numRows) {
      indices.add(Math.floor(randomFn() * numRows));
    }
    
    return Array.from(indices).map(i => [...data[i]]);
  }

  private static euclideanDistance(pointA: number[], pointB: number[]): number {
    let sum = 0;
    for (let i = 0; i < pointA.length; i++) {
      sum += (pointA[i] - pointB[i]) * (pointA[i] - pointB[i]);
    }
    return Math.sqrt(sum);
  }
}
