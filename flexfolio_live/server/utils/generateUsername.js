const Portfolio = require("../models/Portfolio");

async function generateUsername(fullName) {

  const baseUsername = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  let username = baseUsername;

  let counter = 1;

  while (await Portfolio.findOne({ username })) {
    username = `${baseUsername}-${counter}`;
    counter++;
  }

  return username;
}

module.exports = generateUsername;