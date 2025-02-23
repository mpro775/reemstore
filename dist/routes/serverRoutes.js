"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
// إنشاء فئة جديدة
router.post("/create", (0, authMiddleware_1.authenticate)("admin"), categoryController_1.createCategory);
// تعديل فئة موجودة
router.put("/update/:categoryId", (0, authMiddleware_1.authenticate)("admin"), categoryController_1.updateCategory);
// حذف فئة
router.delete("/delete/:categoryId", (0, authMiddleware_1.authenticate)("admin"), categoryController_1.deleteCategory);
// عرض جميع الفئات
router.get("/all", categoryController_1.getAllCategories);
exports.default = router;
