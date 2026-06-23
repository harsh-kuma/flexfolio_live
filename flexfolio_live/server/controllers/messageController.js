const Portfolio = require("../models/Portfolio");
const ContactMessage = require("../models/ContactMessage");
const mongoose = require("mongoose");

exports.getPortfolioMessages = async (req, res) => {
    try {
        const { portfolioId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid portfolio id",
            });
        }

        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = 50;
        const skip = (page - 1) * limit;

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

        const [messages, total, unread] = await Promise.all([
            ContactMessage.find({
                portfolio: portfolio._id,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ContactMessage.countDocuments({
                portfolio: portfolio._id,
            }),

            ContactMessage.countDocuments({
                portfolio: portfolio._id,
                isRead: false,
            }),
        ]);

        return res.json({
            success: true,
            messages,
            page,
            total,
            unread,
            hasMore: skip + messages.length < total,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.markMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message id",
            });
        }

        const message = await ContactMessage.findById(messageId).select("portfolio isRead");

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        const portfolio = await Portfolio.findOne({
            _id: message.portfolio,
            user: req.user.id,
        }).select("_id");

        if (!portfolio) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!message.isRead) {
            await ContactMessage.updateOne(
                {
                    _id: messageId,
                    isRead: false,
                },
                {
                    $set: {
                        isRead: true,
                        readAt: new Date(),
                    },
                }
            );
        }

        return res.json({
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message id",
      });
    }

    const message = await ContactMessage.findById(messageId)
      .select("portfolio");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const portfolio = await Portfolio.findOne({
      _id: message.portfolio,
      user: req.user.id,
    }).select("_id");

    if (!portfolio) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await ContactMessage.deleteOne({
      _id: messageId,
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAllMessages = async (req, res) => {
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

    const result = await ContactMessage.deleteMany({
      portfolio: portfolio._id,
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} messages deleted`,
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};