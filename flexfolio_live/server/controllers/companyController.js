const axios = require("axios");

exports.searchCompany = async (req, res) => {
  const q = req.query.q;

  if (!q) return res.json([]);

  try {
    const response = await axios.get(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${q}`
    );

    const sorted = response.data
      .sort((a, b) => {
        if (a.domain.endsWith(".com")) return -1;
        if (b.domain.endsWith(".com")) return 1;
        return a.domain.length - b.domain.length;
      })
      .slice(0, 5);

    res.json(sorted);
  } catch (err) {
    res.json([]);
  }
};