import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
} from "../controllers/itemController";

const router = express.Router();

// إنشاء صنف جديد
router.post("/create", authenticate("admin"), createItem);

// تعديل صنف موجود
router.put("/update/:itemId", authenticate("admin"), updateItem);

// حذف صنف
router.delete("/delete/:itemId", authenticate("admin"), deleteItem);

// عرض جميع الأصناف
router.get("/all", getAllItems);

export default router;
