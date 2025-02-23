import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoryController";

const router = express.Router();

// إنشاء فئة جديدة
router.post("/create", authenticate("admin"), createCategory);

// تعديل فئة موجودة
router.put("/update/:categoryId", authenticate("admin"), updateCategory);

// حذف فئة
router.delete("/delete/:categoryId", authenticate("admin"), deleteCategory);

// عرض جميع الفئات
router.get("/all", getAllCategories);

export default router;
