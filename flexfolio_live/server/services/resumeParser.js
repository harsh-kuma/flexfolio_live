const pdf = require("pdf-parse");

module.exports = async (buffer) => {
  const result = await pdf(buffer);
  return result.text;
};