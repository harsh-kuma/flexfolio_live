const axios = require("axios");

const vercelApi = axios.create({
  baseURL: "https://api.vercel.com",
  headers: {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
  },
});

exports.addDomainToVercel = async (domain) => {
  return vercelApi.post(
    `/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      name: domain,
    }
  );
};

exports.getDomainInfo = async (domain) => {
  return vercelApi.get(
    `/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`
  );
};

exports.removeDomainFromVercel = async (domain) => {
  return vercelApi.delete(
    `/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}`
  );
};