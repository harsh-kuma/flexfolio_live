const cloudinary = require("../config/cloudinary");

const deleteCloudinaryAsset = async (publicId,resourceType = "image") => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId,{resource_type: resourceType,});
  } catch (error) {
    console.error("Cloudinary delete error:",error.message);
  }
};

module.exports = deleteCloudinaryAsset;