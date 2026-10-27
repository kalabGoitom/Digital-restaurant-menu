import multer from "multer";

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image must be 5 MB or smaller.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Only one image can be uploaded at a time.",
      });
    }

    return res.status(400).json({
      message: "Image upload failed.",
      error: err.message,
    });
  }

  if (err?.message === "Only JPEG, PNG, and WebP images are allowed.") {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
};

export default uploadErrorHandler;
