const multer = require("multer");

const uploadAvatar = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/avatar");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}.${file.originalname}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const isValid = new RegExp("^.*.(jpg|JPG|jpeg|JPEG|PNG|png)$").test(
        file.originalname
      );

      if (isValid) {
        cb(null, true);
      } else {
        cb(new Error("invalid file"), false);
      }
    },
    limits: { fileSize: 10000000 },
  });

  return upload.single("avatar");
};

module.exports = {
  uploadAvatar,
};
