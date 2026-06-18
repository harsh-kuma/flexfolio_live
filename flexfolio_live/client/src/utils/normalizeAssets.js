
export const normalizeAssets = (obj) => {
  if (!obj) return obj;

  if (Array.isArray(obj)) {
    return obj.map(normalizeAssets);
  }

  if (typeof obj === "object") {
    const result = {};

    for (const key in obj) {
      result[key] = normalizeAssets(obj[key]);
    }

    return result;
  }

  return obj;
};