// src/controllers/uploadController.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Config";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  // ← هنا نوع الإرجاع
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return; // ← ضروري لتجنب إرسال ردود متعددة
    }

    const file = req.file;
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

    // رفع الملف إلى S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    // رابط الصورة بعد الرفع
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};
