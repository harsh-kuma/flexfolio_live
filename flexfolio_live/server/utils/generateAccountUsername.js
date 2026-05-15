const User = require("../models/User");

async function generateAccountUsername(name) {

  const baseUsername = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  let username = baseUsername;

  let counter = 1;

  while (await User.findOne({ username })) {

    username = `${baseUsername}${counter}`;

    counter++;
  }

  return username;
}

module.exports = generateAccountUsername;