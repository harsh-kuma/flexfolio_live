const PLAN_FEATURES = require("./planFeatures");

exports.checkAiUsage = (user) => {
  const currentMonth =`${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

  // Reset usage if month changed
  if (user.usage.aiGenerationMonth !== currentMonth) {
    user.usage.aiGenerationMonth = currentMonth;
    user.usage.aiGenerations = 0;
  }

  const plan = user.subscription.plan || "free";
  const limit = PLAN_FEATURES[plan].aiGenerationLimit;

  return {
    canGenerate: user.usage.aiGenerations < limit,
    used: user.usage.aiGenerations,
    limit,
    remaining: Math.max(0, limit - user.usage.aiGenerations),
  };
};