const PLAN_FEATURES = require("./planFeatures");

const getPlan = (user) => {
  return user?.subscription?.plan || "free";
};

const getFeature = (user, feature) => {
  const plan = getPlan(user);
  return PLAN_FEATURES[plan]?.[feature];
};

const hasFeature = (user, feature) => {
  const value = getFeature(user, feature);

  // boolean features
  if (typeof value === "boolean") return value;

  return !!value;
};

const getLimit = (user, feature) => {
  const plan = getPlan(user);
  return PLAN_FEATURES[plan]?.[feature];
};

module.exports = {
  getPlan,
  hasFeature,
  getLimit
};