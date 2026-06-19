const extractAssets = (obj,assets = []) => {
  if (!obj) return assets;

  if (Array.isArray(obj)) {
    obj.forEach(item =>
      extractAssets(item, assets)
    );
    return assets;
  }

  if (typeof obj === "object") {
    if (obj.public_id && obj.url) {
      assets.push({
        public_id: obj.public_id,
        resource_type: obj.resource_type || "image",
        bytes: obj.bytes || 0
      });
    }

    Object.values(obj).forEach(value =>
      extractAssets(value, assets)
    );
  }

  return assets;
};

module.exports = extractAssets;