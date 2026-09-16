import { seededRandom } from '../../../utils/random';

export class MetricsService {
  /**
   * Calculates the Euclidean distance between two vectors.
   */
  private static euclideanDistance(pointA: number[], pointB: number[]): number {
    let sum = 0;
    for (let i = 0; i < pointA.length; i++) {
      const diff = pointA[i] - pointB[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Calculates the approximate Silhouette Score for a clustering assignment.
   * If the dataset is large, it takes a random sample to maintain UI responsiveness.
   * Time Complexity: O(N^2) where N is the number of samples.
   */
  static calculateSilhouetteScore(data: number[][], assignments: number[], maxSamples: number = 1000): number {
    if (data.length === 0 || data.length !== assignments.length) return 0;
    
    // Fixed seed for deterministic sampling
    const random = seededRandom(42);

    // 1. Identify which indices we will actually evaluate to save time
    const numRows = data.length;
    let indicesToEvaluate: number[] = [];
    
    if (numRows <= maxSamples) {
      indicesToEvaluate = Array.from({ length: numRows }, (_, i) => i);
    } else {
      // Reservoir sampling or simply random shuffling for a subset
      const set = new Set<number>();
      while (set.size < maxSamples) {
        set.add(Math.floor(random() * numRows));
      }
      indicesToEvaluate = Array.from(set);
    }

    // 2. Pre-calculate the total size of each cluster within the SAMPLE
    // Actually, to get true distances, we should calculate distance to all points in the true dataset,
    // or just distance to the sample. For speed, distance to the sample is standard in approximation.
    const sampleData = indicesToEvaluate.map(i => data[i]);
    const sampleAssignments = indicesToEvaluate.map(i => assignments[i]);
    const numSamples = sampleData.length;

    // Group sample indices by cluster
    const clusterToSampleIndices = new Map<number, number[]>();
    for (let i = 0; i < numSamples; i++) {
      const cluster = sampleAssignments[i];
      if (!clusterToSampleIndices.has(cluster)) {
        clusterToSampleIndices.set(cluster, []);
      }
      clusterToSampleIndices.get(cluster)!.push(i);
    }

    // 3. Calculate score for each sampled point
    let totalScore = 0;

    for (let i = 0; i < numSamples; i++) {
      const pointA = sampleData[i];
      const clusterA = sampleAssignments[i];
      
      const indicesInSameCluster = clusterToSampleIndices.get(clusterA)!;
      
      // Calculate a(i): Mean distance to all other points in the SAME cluster
      let a = 0;
      if (indicesInSameCluster.length > 1) {
        let sumA = 0;
        for (const siblingIdx of indicesInSameCluster) {
          if (siblingIdx !== i) {
            sumA += this.euclideanDistance(pointA, sampleData[siblingIdx]);
          }
        }
        a = sumA / (indicesInSameCluster.length - 1);
      }

      // Calculate b(i): Min mean distance to all points in any OTHER cluster
      let b = Infinity;
      
      clusterToSampleIndices.forEach((indicesInOtherCluster, clusterB) => {
        if (clusterA === clusterB) return; // skip same cluster
        
        let sumB = 0;
        for (const otherIdx of indicesInOtherCluster) {
          sumB += this.euclideanDistance(pointA, sampleData[otherIdx]);
        }
        const meanDistanceToClusterB = sumB / indicesInOtherCluster.length;
        if (meanDistanceToClusterB < b) {
          b = meanDistanceToClusterB;
        }
      });

      // Silhouette Score for point i
      if (indicesInSameCluster.length > 1) {
        const s = (b - a) / Math.max(a, b);
        // Handle cases where max(a,b) is 0 (all points identical)
        totalScore += isNaN(s) ? 0 : s;
      }
    }

    return numSamples > 0 ? totalScore / numSamples : 0;
  }
}
