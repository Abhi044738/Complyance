const clampToScore = (value) => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

const calculateDataScore = (typeStats, rowsParsed) => {
  const totalCells = Math.max(1, typeStats.totalCells || 1);
  const validCells =
    (typeStats.number || 0) + (typeStats.date || 0) + (typeStats.text || 0);
  const typeQuality = validCells / totalCells;
  const rowQuality = rowsParsed > 0 ? 1 : 0;

  return clampToScore(100 * (0.5 * typeQuality + 0.5 * rowQuality));
};

const calculateCoverageScore = (coverage) => {
  const totalTargets =
    coverage.matched.length + coverage.close.length + coverage.missing.length;
  const weightedMatches =
    coverage.matched.length * 1 + coverage.close.length * 0.5;
  const coverageShare = totalTargets > 0 ? weightedMatches / totalTargets : 0;

  return clampToScore(100 * coverageShare);
};

const calculateRulesScore = (ruleFindings) => {
  const totalRules = ruleFindings.length || 5;
  const passedRules = ruleFindings.filter((rule) => rule.ok).length;

  return clampToScore(100 * (passedRules / totalRules));
};

const calculatePostureScore = (questionnaire) => {
  const postureFlags = ["webhooks", "sandbox_env", "retries"];
  const enabledFlags = postureFlags.filter(
    (flag) => !!questionnaire?.[flag]
  ).length;

  return clampToScore((enabledFlags / postureFlags.length) * 100);
};

export const computeReadinessScores = ({
  rowsParsed,
  linesTotal,
  typeStats,
  coverage,
  ruleFindings,
  questionnaire,
}) => {
  const dataScore = calculateDataScore(typeStats, rowsParsed);
  const coverageScore = calculateCoverageScore(coverage);
  const rulesScore = calculateRulesScore(ruleFindings);
  const postureScore = calculatePostureScore(questionnaire);

  const overallScore = clampToScore(
    dataScore * 0.25 +
      coverageScore * 0.35 +
      rulesScore * 0.3 +
      postureScore * 0.1
  );

  return {
    data: dataScore,
    coverage: coverageScore,
    rules: rulesScore,
    posture: postureScore,
    overall: overallScore,
  };
};
