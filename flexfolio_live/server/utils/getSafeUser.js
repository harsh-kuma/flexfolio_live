exports.getSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  profile: user.profile,
  isVerified: user.isVerified,

  subscription: {
    plan: user.subscription?.plan || "free",
    status: user.subscription?.status || "active",
    startDate: user.subscription?.startDate || null,
    endDate: user.subscription?.endDate || null,
  },

  usage: {
    portfolios: user.usage?.portfolios || 0,
  }
});