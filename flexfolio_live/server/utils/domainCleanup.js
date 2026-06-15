const Portfolio = require("../models/Portfolio");

async function canDeleteDomain(domain, currentPortfolioId) {
  const count = await Portfolio.countDocuments({
    _id: { $ne: currentPortfolioId },
    $or: [
      { customDomain: domain },
      { pendingDomain: domain },
    ],
  });

  return count === 0;
}

module.exports = {
  canDeleteDomain,
};