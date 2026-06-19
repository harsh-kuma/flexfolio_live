const PLAN_FEATURES = {
  free: {
    maxPortfolios: 2,
    maxDomains: 0,
    maxMediaFiles: 20,
    storageLimit: 20 * 1024 * 1024,
    portfolioViewsLimit: 500,
    aiGenerationLimit: 5,
    customDomain: false,
    seoSettings: false,
    analytics: false,
    removeBranding: false,
    exportPdf: false,
    exportJson: false,
    contactForm: false,
    prioritySupport: false,
    templates: "free"
  },

  basic: {
    maxPortfolios: 5,
    maxDomains: 1,
    maxMediaFiles: 500,
    storageLimit: 500 * 1024 * 1024,
    portfolioViewsLimit: 10000,
    aiGenerationLimit: 100,
    customDomain: true,
    seoSettings: true,
    analytics: "basic",
    removeBranding: true,
    exportPdf: true,
    exportJson: false,
    contactForm: true,
    prioritySupport: false,
    templates: "standard"
  },

  pro: {
    maxPortfolios: -1,
    maxDomains: 5,
    maxMediaFiles: -1,
    storageLimit: 5 * 1024 * 1024 * 1024,
    portfolioViewsLimit: -1,
    aiGenerationLimit: -1,
    customDomain: true,
    seoSettings: true,
    analytics: "advanced",
    removeBranding: true,
    exportPdf: true,
    exportJson: true,
    contactForm: true,
    prioritySupport: true,
    templates: "premium"
  }
};

module.exports = PLAN_FEATURES;