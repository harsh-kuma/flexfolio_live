const PLAN_FEATURES = {
  free: {
    maxPortfolios: 2,
    analytics: "basic",
    customDomain: false,
    premiumTemplates: false,
    exportPDF: false
  },

  pro: {
    maxPortfolios: -1, // unlimited
    analytics: "advanced",
    customDomain: false,
    premiumTemplates: true,
    exportPDF: true
  }
};

module.exports = PLAN_FEATURES;