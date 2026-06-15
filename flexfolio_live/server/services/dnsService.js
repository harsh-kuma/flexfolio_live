const dns = require("dns").promises;

exports.verifyFlexfolioToken = async (domain,token) => {
  try {
    const records = await dns.resolveTxt(`_flexfolio.${domain}`);
    const txtRecords = records.flat().map((r) => r.trim());
    return txtRecords.includes(token);
  } catch {
    return false;
  }
};