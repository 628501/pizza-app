import { Router } from "express";
import admin from "../MiddleWare/admin.mid.js";
import multer from "multer";
import handler from "express-async-handler";
import { BAD_REQUEST } from "../Constants/httpStatus.js";
import { configCloudinary } from "../Config/cloudinary.config.js";

const router = Router();
const upload = multer();

router.post(
  "/",
  admin,
  upload.single("image"),
  handler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(BAD_REQUEST).send();
      return;
    }

    const imageUrl = await uploadImageToCloudinary(req.file?.buffer);
    res.send({ imageUrl });
  })
);

const uploadImageToCloudinary = (imageBuffer) => {
  const cloudinary = configCloudinary();

  return new Promise((resolve, reject) => {
    if (!imageBuffer) reject(null);

    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error || !result) reject(error);
        else resolve(result.url);
      })
      .end(imageBuffer);
  });
};

export default router;
