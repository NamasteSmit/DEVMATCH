const express = require("express");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/upload");

router.post("/upload-image", upload.single("file"), async (req, res) => {
  console.log("Inside : IMage upload ")
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not found",
      });
    }

    const buffer = req.file.buffer;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hello-q/images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    return res.status(200).json({
      success: true,
      image: {
        secure_url : uploadResult
      },
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
});

module.exports = router;
