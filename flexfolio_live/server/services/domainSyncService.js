const { verifyFlexfolioToken } = require("./dnsService");
const { getDomainInfo } = require("./domainService");

async function refreshDomainStatus(portfolio) {
  const domain = portfolio.customDomain;
  if (!domain) return portfolio;

  let vercelVerified = false;
  let tokenVerified = false;

  try {
    const domainInfo = await getDomainInfo(domain);
    vercelVerified = domainInfo?.data?.verified === true;

    tokenVerified = await verifyFlexfolioToken(domain,portfolio.domainVerificationToken);
  } catch (error) {
    console.error(error);
  }

  const verified = vercelVerified && tokenVerified;

  portfolio.domainVerified = verified;

  if (!verified) {
    portfolio.domainConnectedAt = null;
    portfolio.pendingDomain = portfolio.customDomain;
    portfolio.customDomain = null;
    if (!vercelVerified) {
      portfolio.domainVerificationError = "Domain is no longer configured in DNS";
    } else if (!tokenVerified) {
      portfolio.domainVerificationError = "Ownership verification record missing";
    }
  } else {
    portfolio.domainVerificationError = null;
  }
  await portfolio.save();
  return portfolio;
}

module.exports = {
  refreshDomainStatus,
};