/**
 * Calculates weighted scores for overall system readiness
 */
export function calculateWeightedScore(
  scores: number[],
  weights: number[]
): number {
  if (scores.length !== weights.length) {
    throw new Error('Scores and weights must have identical lengths');
  }
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  if (sumWeights === 0) return 0;

  const weightedSum = scores.reduce((sum, score, idx) => sum + score * weights[idx], 0);
  return Math.round(weightedSum / sumWeights);
}

/**
 * Calculates safety / policy health score based on active issues
 */
export function calculateHealthFromIssues(issueCount: number, penaltyPerIssue: number = 10): number {
  return Math.max(0, 100 - issueCount * penaltyPerIssue);
}
