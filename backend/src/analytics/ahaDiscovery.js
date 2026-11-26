/**
 * Product Aha-Moment Discovery Engine
 * Evaluates candidate behavioral triggers against long-term user retention
 * using Shannon Entropy Information Gain, Pearson Phi Correlation, and Precision/Recall optimization.
 */

export class AhaMomentDiscoveryEngine {
  /**
   * Discover top Aha moments from user action logs and retention outcomes
   * @param {Array<Object>} users - Array of user records [{ userId, actions: { actionName: count }, retained: boolean }]
   * @param {Object} [options]
   * @param {number} [options.minUserCoveragePct=5.0] - Minimum % of user base that must perform the action
   * @returns {Object} Ranked Aha moment candidates with Information Gain and retention metrics
   */
  discoverAhaMoments(users, options = {}) {
    if (!users || users.length < 10) {
      throw new Error('Dataset must contain at least 10 user records to compute meaningful statistics');
    }

    const n = users.length;
    const baseRetainedCount = users.filter(u => u.retained).length;
    const baseRetentionRate = baseRetainedCount / n;
    const baseEntropy = this._shannonEntropy([baseRetainedCount, n - baseRetainedCount]);

    // Collect all candidate action names
    const actionNames = new Set();
    for (const u of users) {
      for (const act of Object.keys(u.actions || {})) {
        actionNames.add(act);
      }
    }

    const candidateRules = [];

    // Evaluate each action across potential integer thresholds (1 to 10)
    for (const actionName of actionNames) {
      // Find range of values observed
      const values = users.map(u => (u.actions && u.actions[actionName]) || 0);
      const uniqueThresholds = Array.from(new Set(values)).filter(v => v > 0).sort((a, b) => a - b);

      for (const threshold of uniqueThresholds) {
        // Partition users: group A (reached threshold) vs group B (below threshold)
        const hitGroup = users.filter(u => ((u.actions && u.actions[actionName]) || 0) >= threshold);
        const missGroup = users.filter(u => ((u.actions && u.actions[actionName]) || 0) < threshold);

        if (hitGroup.length === 0 || missGroup.length === 0) continue;

        const hitRetained = hitGroup.filter(u => u.retained).length;
        const hitChurned = hitGroup.length - hitRetained;
        const missRetained = missGroup.filter(u => u.retained).length;
        const missChurned = missGroup.length - missRetained;

        const hitRetentionRate = hitRetained / hitGroup.length;
        const missRetentionRate = missRetained / missGroup.length;

        // Shannon Entropy after split
        const entropyHit = this._shannonEntropy([hitRetained, hitChurned]);
        const entropyMiss = this._shannonEntropy([missRetained, missChurned]);
        const splitEntropy = (hitGroup.length / n) * entropyHit + (missGroup.length / n) * entropyMiss;
        const infoGain = baseEntropy - splitEntropy;

        // Phi coefficient / Pearson correlation for 2x2 binary contingency table
        const phi = (hitRetained * missChurned - hitChurned * missRetained) /
          Math.sqrt(
            (hitRetained + hitChurned) *
            (missRetained + missChurned) *
            (hitRetained + missRetained) *
            (hitChurned + missChurned) || 1
          );

        // Precision & Recall
        const precision = hitRetained / (hitGroup.length || 1); // If hit threshold, % chance retained
        const recall = hitRetained / (baseRetainedCount || 1);   // % of all retained users who hit this
        const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

        // Composite power score: balances information gain and correlation
        const compositeScore = Math.max(0, infoGain * 0.5 + Math.max(0, phi) * 0.5);

        candidateRules.push({
          actionName,
          threshold,
          ruleLabel: `${actionName} >= ${threshold}`,
          usersReachingThreshold: hitGroup.length,
          coveragePct: Number(((hitGroup.length / n) * 100).toFixed(1)),
          hitRetentionRatePct: Number((hitRetentionRate * 100).toFixed(1)),
          missRetentionRatePct: Number((missRetentionRate * 100).toFixed(1)),
          retentionLiftPct: Number(((hitRetentionRate - baseRetentionRate) * 100).toFixed(1)),
          informationGain: Number(infoGain.toFixed(4)),
          correlationPhi: Number(phi.toFixed(4)),
          precision: Number(precision.toFixed(3)),
          recall: Number(recall.toFixed(3)),
          f1Score: Number(f1Score.toFixed(3)),
          compositeScore: Number(compositeScore.toFixed(4))
        });
      }
    }

    // Sort by composite score descending
    candidateRules.sort((a, b) => b.compositeScore - a.compositeScore);

    const bestAhaMoment = candidateRules[0] || null;

    return {
      totalUsers: n,
      baseRetentionRatePct: Number((baseRetentionRate * 100).toFixed(1)),
      bestAhaMoment,
      rankedAhaCandidates: candidateRules.slice(0, 10)
    };
  }

  _shannonEntropy(counts) {
    const total = counts.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;

    let entropy = 0;
    for (const c of counts) {
      if (c > 0) {
        const p = c / total;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy;
  }
}

export default AhaMomentDiscoveryEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AhaMomentDiscoveryEngine;
  module.exports.AhaMomentDiscoveryEngine = AhaMomentDiscoveryEngine;
}
