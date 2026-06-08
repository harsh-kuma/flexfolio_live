exports.getSafePortfolio = (portfolio) => ({
  _id: portfolio._id,
  user: portfolio.user,
  username: portfolio.username,
  templateKey: portfolio.templateKey,
  category: portfolio.category,
  templateSlug: portfolio.templateSlug,
  title: portfolio.title,
  thumbnail: portfolio.thumbnail,
  isPublished: portfolio.isPublished,
  email:portfolio.email,
  emailVerified: portfolio.emailVerified,

  data: portfolio.data,

  createdAt: portfolio.createdAt,
  updatedAt: portfolio.updatedAt,
});