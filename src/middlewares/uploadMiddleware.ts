import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// إعداد تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // المجلد الذي سيتم تخزين الصور فيه
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName); // اسم الملف الفريد
  },
});

// التحقق من نوع الملف
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// تصدير Middleware
export const upload = multer({ storage, fileFilter });
