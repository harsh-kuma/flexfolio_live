const PLAN_FEATURES = {
  free: {
    maxPortfolios: 1,
    maxDomains: 0,
    maxMediaFiles: 20,
    storageLimit: 20 * 1024 * 1024,
    analytics: false,
    premiumTemplates: false,
    exportPDF: false
  },

  basic: {
    maxPortfolios: 5,
    maxDomains: 1,
    maxMediaFiles: 500,
    storageLimit: 500 * 1024 * 1024,
    analytics: true,
    premiumTemplates: false,
    exportPDF: true
  },

  pro: {
    maxPortfolios: -1,
    maxDomains: 5,
    maxMediaFiles: 2000,
    storageLimit: 2 * 1024 * 1024 * 1024,
    analytics: true,
    premiumTemplates: true,
    exportPDF: true
  }
};

module.exports = PLAN_FEATURES;