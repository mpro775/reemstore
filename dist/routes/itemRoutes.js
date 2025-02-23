"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const itemController_1 = require("../controllers/itemController");
const router = express_1.default.Router();
// إنشاء صنف جديد
router.post("/create", (0, authMiddleware_1.authenticate)("admin"), itemController_1.createItem);
// تعديل صنف موجود
router.put("/update/:itemId", (0, authMiddleware_1.authenticate)("admin"), itemController_1.updateItem);
// حذف صنف
router.delete("/delete/:itemId", (0, authMiddleware_1.authenticate)("admin"), itemController_1.deleteItem);
// عرض جميع الأصناف
router.get("/all", itemController_1.getAllItems);
exports.default = router;
