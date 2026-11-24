/**
 * K-Means Behavioral Clustering Engine with Silhouette Scoring
 * Implements K-Means++ initialization, iterative Lloyd optimization, and silhouette score evaluation.
 */

export class KMeansClusterer {
  /**
   * @param {Object} options
   * @param {number} [options.k=3] - Target number of behavioral clusters
   * @param {number} [options.maxIterations=100] - Maximum optimization iterations
   * @param {number} [options.tolerance=1e-4] - Convergence centroid movement threshold
   */
  constructor(options = {}) {
    this.k = options.k || 3;
    this.maxIterations = options.maxIterations || 100;
    this.tolerance = options.tolerance || 1e-4;
  }

  /**
   * Fit K-Means model to multi-dimensional user behavioral vectors
   * @param {Array<Array<number>>} data - 2D matrix of shape [N, D]
   * @param {Array<string>} [featureNames] - Optional names of the dimensions
   * @returns {Object} Trained clustering results with assignments, centroids, and metrics
   */
  fit(data, featureNames = []) {
    if (!data || data.length < this.k) {
      throw new Error(`Dataset must contain at least k=${this.k} data points`);
    }

    const n = data.length;
    const d = data[0].length;

    // 1. K-Means++ Initialization
    let centroids = this._initKMeansPlusPlus(data, this.k);
    let assignments = new Array(n).fill(0);
    let iterations = 0;
    let converged = false;

    // 2. Lloyd's Optimization Loop
    while (iterations < this.maxIterations && !converged) {
      iterations++;

      // Expectation Step: Assign each point to closest centroid
      let changed = false;
      for (let i = 0; i < n; i++) {
        let minDist = Infinity;
        let closestCluster = 0;

        for (let c = 0; c < this.k; c++) {
          const dist = this._euclideanDistance(data[i], centroids[c]);
          if (dist < minDist) {
            minDist = dist;
            closestCluster = c;
          }
        }

        if (assignments[i] !== closestCluster) {
          assignments[i] = closestCluster;
          changed = true;
        }
      }

      // Maximization Step: Recompute centroid positions
      const newCentroids = Array.from({ length: this.k }, () => new Array(d).fill(0));
      const counts = new Array(this.k).fill(0);

      for (let i = 0; i < n; i++) {
        const cluster = assignments[i];
        counts[cluster]++;
        for (let j = 0; j < d; j++) {
          newCentroids[cluster][j] += data[i][j];
        }
      }

      for (let c = 0; c < this.k; c++) {
        if (counts[c] > 0) {
          for (let j = 0; j < d; j++) {
            newCentroids[c][j] /= counts[c];
          }
        } else {
          // If a cluster became empty, reinitialize to a random point
          newCentroids[c] = [...data[Math.floor(Math.random() * n)]];
        }
      }

      // Check convergence by centroid displacement
      let maxDisplacement = 0;
      for (let c = 0; c < this.k; c++) {
        const shift = this._euclideanDistance(centroids[c], newCentroids[c]);
        if (shift > maxDisplacement) maxDisplacement = shift;
      }

      centroids = newCentroids;
      if (maxDisplacement < this.tolerance || !changed) {
        converged = true;
      }
    }

    // 3. Inertia (Within-Cluster Sum of Squares)
    let inertia = 0;
    for (let i = 0; i < n; i++) {
      inertia += Math.pow(this._euclideanDistance(data[i], centroids[assignments[i]]), 2);
    }

    // 4. Silhouette Score Calculation
    const silhouetteScore = this._computeSilhouetteScore(data, assignments, this.k);

    // 5. Cluster breakdown and profiles
    const clusterSummary = Array.from({ length: this.k }, (_, c) => {
      const clusterPoints = data.filter((_, idx) => assignments[idx] === c);
      return {
        clusterId: c,
        size: clusterPoints.length,
        percentage: Number(((clusterPoints.length / n) * 100).toFixed(1)),
        centroid: centroids[c].map(val => Number(val.toFixed(2)))
      };
    });

    return {
      k: this.k,
      totalSamples: n,
      iterations,
      converged,
      inertia: Number(inertia.toFixed(2)),
      silhouetteScore: Number(silhouetteScore.toFixed(3)),
      centroids,
      assignments,
      clusters: clusterSummary
    };
  }

  _initKMeansPlusPlus(data, k) {
    const centroids = [];
    const n = data.length;

    // Pick first centroid uniformly at random
    centroids.push([...data[Math.floor(Math.random() * n)]]);

    while (centroids.length < k) {
      const distances = data.map(pt => {
        let minD = Infinity;
        for (const c of centroids) {
          const d = this._euclideanDistance(pt, c);
          if (d < minD) minD = d;
        }
        return minD * minD; // Square distance for probability weighting
      });

      const totalDist = distances.reduce((a, b) => a + b, 0);
      let target = Math.random() * totalDist;

      for (let i = 0; i < n; i++) {
        target -= distances[i];
        if (target <= 0) {
          centroids.push([...data[i]]);
          break;
        }
      }

      if (centroids.length < k && target > 0) {
        centroids.push([...data[n - 1]]);
      }
    }

    return centroids;
  }

  _euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  _computeSilhouetteScore(data, assignments, k) {
    const n = data.length;
    if (k <= 1 || k >= n) return 0;

    let totalSilhouette = 0;

    for (let i = 0; i < n; i++) {
      const myCluster = assignments[i];
      
      // Calculate a(i): average distance to points in same cluster
      let sameClusterDist = 0;
      let sameClusterCount = 0;

      for (let j = 0; j < n; j++) {
        if (i !== j && assignments[j] === myCluster) {
          sameClusterDist += this._euclideanDistance(data[i], data[j]);
          sameClusterCount++;
        }
      }
      const a = sameClusterCount > 0 ? sameClusterDist / sameClusterCount : 0;

      // Calculate b(i): minimum average distance to points in any other cluster
      let minOtherClusterDist = Infinity;

      for (let c = 0; c < k; c++) {
        if (c !== myCluster) {
          let otherDist = 0;
          let otherCount = 0;

          for (let j = 0; j < n; j++) {
            if (assignments[j] === c) {
              otherDist += this._euclideanDistance(data[i], data[j]);
              otherCount++;
            }
          }

          if (otherCount > 0) {
            const avgOther = otherDist / otherCount;
            if (avgOther < minOtherClusterDist) {
              minOtherClusterDist = avgOther;
            }
          }
        }
      }
      const b = minOtherClusterDist === Infinity ? 0 : minOtherClusterDist;

      const s = Math.max(a, b) === 0 ? 0 : (b - a) / Math.max(a, b);
      totalSilhouette += s;
    }

    return totalSilhouette / n;
  }
}

export default KMeansClusterer;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = KMeansClusterer;
  module.exports.KMeansClusterer = KMeansClusterer;
}
