function getResourceType(mimetype) {
  if ( mimetype && mimetype.startsWith("image/")) {
    return "image";
  }

  if (mimetype && mimetype.startsWith("video/")) {
    return "video";
  }

  return "raw";
}

module.exports = getResourceType;