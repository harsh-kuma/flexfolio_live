const cloudinary = require("../config/cloudinary");

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error.message
    );
  }
};

module.exports = deleteCloudinaryImage;