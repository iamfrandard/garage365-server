const multer = require("multer");

const storageOptions = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, "./app/files/");
    } else {
      cb(null, "./app/images/");
    }
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}.${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, png, or pdf files are supported"), false);
  }
};

module.exports = {
  storageOptions: storageOptions,
  fileFilter: fileFilter,
  fileSize: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
};
