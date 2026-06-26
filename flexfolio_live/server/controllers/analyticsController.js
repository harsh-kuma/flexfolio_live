const mongoose = require("mongoose");
const Analytics = require("../models/Analytics");
const Portfolio = require("../models/Portfolio");

// =======================
// TRACK EVENT
// =======================
exports.trackEvent = async (req, res) => {
  try {
    const {
      portfolioId,
      eventType,
      visitorId,
      sessionId,
      meta = null,
      duration = 0,
    } = req.body;

    if (!portfolioId || !visitorId || !sessionId || !eventType) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const portfolio = await Portfolio.findById(portfolioId).populate("user", "subscription");
    const plan = portfolio?.user?.subscription?.plan || "free";

    if (plan === "free") {
      return res.status(200).json({
        success: true,
        skipped: true,
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

    const userAgent = req.headers["user-agent"] || null;

    // =======================
    // SESSION TRACKING
    // =======================
    if (eventType === "session") {
      await Analytics.findOneAndUpdate(
        {
          portfolioId,
          sessionId,
          eventType: "session",
        },
        {
          $max: {
            duration,
          },
          $set: {
            ip,
            userAgent,
            visitorId,
            sessionId,
          },
          $setOnInsert: {
            portfolioId,
            eventType: "session",
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );

      return res.status(200).json({
        success: true,
      });
    }


    // =======================
    // CLICK EVENT
    // =======================
    if (eventType === "click") {
      await Analytics.create({
        portfolioId,
        eventType,
        visitorId,
        sessionId,
        meta,
        ip,
        userAgent,
      });

      return res.status(200).json({
        success: true,
      });
    }

    // =======================
    // NORMAL EVENT CREATE
    // =======================
    await Analytics.create({
      portfolioId,
      eventType,
      visitorId,
      sessionId,
      meta,
      duration,
      ip,
      userAgent,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({
        success: true,
        skipped: true,
      });
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// =======================
// ANALYTICS SUMMARY
// =======================
exports.getSummary = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio id",
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      user: req.user.id,
    }).select("_id");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const objectId = new mongoose.Types.ObjectId(portfolioId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalViews,
      totalClicks,
      uniqueVisitors,
      todayViews,
      sessionStats,
      topClicks,
      recentViews,
    ] = await Promise.all([
      Analytics.countDocuments({
        portfolioId: objectId,
        eventType: "view",
      }),

      Analytics.countDocuments({
        portfolioId: objectId,
        eventType: "click",
      }),

      Analytics.distinct("visitorId", {
        portfolioId: objectId,
      }),

      Analytics.countDocuments({
        portfolioId: objectId,
        eventType: "view",
        createdAt: {
          $gte: today,
        },
      }),

      Analytics.aggregate([
        {
          $match: {
            portfolioId: objectId,
            eventType: "session",
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: {
              $avg: "$duration",
            },
            maxDuration: {
              $max: "$duration",
            },
            totalDuration: {
              $sum: "$duration",
            },
          },
        },
      ]),

      Analytics.aggregate([
        {
          $match: {
            portfolioId: objectId,
            eventType: "click",
            meta: {
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: "$meta",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      Analytics.aggregate([
        {
          $match: {
            portfolioId: objectId,
            eventType: "view",
          },
        },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
            },
            views: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.day": -1,
          },
        },
        {
          $limit: 15,
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,

      overview: {
        totalViews,
        totalClicks,
        uniqueVisitors: uniqueVisitors.length,
        todayViews,
      },

      engagement: {
        averageVisitTime: Math.round(
          sessionStats?.[0]?.avgDuration || 0
        ),
        longestVisit: Math.round(
          sessionStats?.[0]?.maxDuration || 0
        ),
        totalVisitTime: Math.round(
          sessionStats?.[0]?.totalDuration || 0
        ),
      },

      topClicks,

      chart: recentViews.reverse(),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


exports.getMyAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all user portfolios with required fields
    const portfolios = await Portfolio.find({ user: userId, isPublished: true })
      .select(
        "_id title thumbnail username category templateSlug isPublished createdAt"
      )
      .lean();

    const portfolioIds = portfolios.map((p) => p._id);

    // If no portfolios
    if (!portfolioIds.length) {
      return res.status(200).json({
        success: true,
        overview: {
          totalPortfolios: 0,
          totalViews: 0,
          totalClicks: 0,
          uniqueVisitors: 0,
          todayViews: 0,
        },
        engagement: {
          averageVisitTime: 0,
          longestVisit: 0,
          totalVisitTime: 0,
        },
        topClicks: [],
        chart: [],
        portfolios: [],
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Run all global analytics in parallel
    const [
      totalViews,
      totalClicks,
      uniqueVisitors,
      todayViews,
      sessionStats,
      topClicks,
      recentViews,
      portfolioAnalytics,
    ] = await Promise.all([
      // TOTAL VIEWS
      Analytics.countDocuments({
        portfolioId: { $in: portfolioIds },
        eventType: "view",
      }),

      // TOTAL CLICKS
      Analytics.countDocuments({
        portfolioId: { $in: portfolioIds },
        eventType: "click",
      }),

      // UNIQUE VISITORS
      Analytics.distinct("visitorId", {
        portfolioId: { $in: portfolioIds },
      }),

      // TODAY VIEWS
      Analytics.countDocuments({
        portfolioId: { $in: portfolioIds },
        eventType: "view",
        createdAt: { $gte: today },
      }),

      // SESSION STATS
      Analytics.aggregate([
        {
          $match: {
            portfolioId: { $in: portfolioIds },
            eventType: "session",
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: "$duration" },
            maxDuration: { $max: "$duration" },
            totalDuration: { $sum: "$duration" },
          },
        },
      ]),

      // TOP CLICKS
      Analytics.aggregate([
        {
          $match: {
            portfolioId: { $in: portfolioIds },
            eventType: "click",
            meta: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$meta",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // DAILY CHART
      Analytics.aggregate([
        {
          $match: {
            portfolioId: { $in: portfolioIds },
            eventType: "view",
          },
        },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
            },
            views: { $sum: 1 },
          },
        },
        { $sort: { "_id.day": -1 } },
        { $limit: 15 },
      ]),

      // PER-PORTFOLIO ANALYTICS
      Analytics.aggregate([
        {
          $match: {
            portfolioId: { $in: portfolioIds },
          },
        },
        {
          $group: {
            _id: "$portfolioId",

            views: {
              $sum: {
                $cond: [
                  { $eq: ["$eventType", "view"] },
                  1,
                  0,
                ],
              },
            },

            clicks: {
              $sum: {
                $cond: [
                  { $eq: ["$eventType", "click"] },
                  1,
                  0,
                ],
              },
            },

            uniqueVisitors: {
              $addToSet: "$visitorId",
            },
          },
        },
      ]),
    ]);

    // 3. Convert analytics into map for fast lookup
    const analyticsMap = {};

    portfolioAnalytics.forEach((item) => {
      analyticsMap[item._id.toString()] = {
        views: item.views,
        clicks: item.clicks,
        uniqueVisitors: item.uniqueVisitors.length,
      };
    });

    // 4. Merge portfolio + analytics
    const portfolioList = portfolios.map((p) => ({
      _id: p._id,
      title: p.title,
      thumbnail: p.thumbnail,
      username: p.username,
      category: p.category,
      templateSlug: p.templateSlug,
      isPublished: p.isPublished,
      createdAt: p.createdAt,

      views: analyticsMap[p._id.toString()]?.views || 0,
      clicks: analyticsMap[p._id.toString()]?.clicks || 0,
      uniqueVisitors:
        analyticsMap[p._id.toString()]?.uniqueVisitors || 0,
    }));

    // 5. Final response
    return res.status(200).json({
      success: true,

      overview: {
        totalPortfolios: portfolioIds.length,
        totalViews,
        totalClicks,
        uniqueVisitors: uniqueVisitors.length,
        todayViews,
      },

      engagement: {
        averageVisitTime: Math.round(
          sessionStats?.[0]?.avgDuration || 0
        ),
        longestVisit: Math.round(
          sessionStats?.[0]?.maxDuration || 0
        ),
        totalVisitTime: Math.round(
          sessionStats?.[0]?.totalDuration || 0
        ),
      },

      topClicks,
      chart: recentViews.reverse(),

      portfolios: portfolioList,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};