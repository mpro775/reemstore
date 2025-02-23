"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.addAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
// إضافة أدمن جديد بواسطة السوبر أدمن
const addAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // التحقق مما إذا كان المستخدم موجودًا بالفعل
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Admin already exists" });
            return;
        }
        // إنشاء الأدمن الجديد
        const newAdmin = new User_1.default({
            email,
            password, // يجب تشفيرها قبل الحفظ
            role: "admin",
        });
        await newAdmin.save();
        res.status(201).json({ message: "Admin added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addAdmin = addAdmin;
// حذف أدمن بواسطة السوبر أدمن
const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        // التحقق مما إذا كان الأدمن موجودًا
        const admin = await User_1.default.findById(adminId);
        if (!admin || admin.role !== "admin") {
            res.status(400).json({ message: "Admin not found" });
            return;
        }
        // حذف الأدمن
        await User_1.default.findByIdAndDelete(adminId);
        res.status(200).json({ message: "Admin deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteAdmin = deleteAdmin;
