exports.getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  profile: user.profile,
  isVerified: user.isVerified,
});