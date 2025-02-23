import express from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { uploadImage } from "../controllers/uploadController";

const router = express.Router();

// Route لرفع الصور
router.post("/upload", upload.single("image"), uploadImage);

export default router;
