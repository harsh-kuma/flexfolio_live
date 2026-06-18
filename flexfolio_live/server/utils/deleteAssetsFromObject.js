const deleteCloudinaryAsset = require("./deleteCloudinaryAsset");

async function deleteAssetsFromObject(obj) {
  if (!obj) return;

  if (typeof obj === "object" && obj.public_id) {
    await deleteCloudinaryAsset(obj.public_id,obj.resource_type || "image");
    return;
  }

  if (typeof obj === "object") {
    for (const key in obj) {
      await deleteAssetsFromObject(obj[key]);
    }
  }
}

module.exports = deleteAssetsFromObject;