exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message, } = req.body;
    console.log()

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: "working properly",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};