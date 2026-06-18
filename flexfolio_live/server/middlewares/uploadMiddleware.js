const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const isPdf = file.mimetype === "application/pdf";
    return {
      folder: isPdf ? "flexfolio/documents" : "flexfolio/images",
      format: isPdf ? "pdf" : undefined,
      resource_type: isPdf ? "raw" : "image",
    };
  },
});

const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024,},

  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf",];

    if (allowed.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb( new Error("Only images and PDFs are allowed"));
  },
});

module.exports = upload;