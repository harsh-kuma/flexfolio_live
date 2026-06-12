const Portfolio = require("../models/Portfolio");
const RESERVED_USERNAMES = require("./reservedUsernames");

async function generateUsername(fullName) {

  let baseUsername = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");

  if (!baseUsername) {
    baseUsername = "user";
  }
  
  if (RESERVED_USERNAMES.has(baseUsername)) {
    baseUsername = `${baseUsername}-user`;
  }

  let username = baseUsername;

  let counter = 1;

  while (await Portfolio.findOne({ username })) {
    username = `${baseUsername}-${counter}`;
    counter++;
  }

  return username;
}

module.exports = generateUsername;