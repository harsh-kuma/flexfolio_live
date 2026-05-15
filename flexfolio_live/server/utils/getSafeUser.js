exports.getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  profile: user.profile,
  provider: user.provider,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});