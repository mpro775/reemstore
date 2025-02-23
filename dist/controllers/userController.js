"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = exports.getUserStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// إحصائيات المستخدمين
const getUserStats = async (_req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const admins = await User_1.default.countDocuments({ role: "admin" });
        const superAdmins = await User_1.default.countDocuments({ role: "super-admin" });
        res.status(200).json({
            totalUsers,
            admins,
            superAdmins,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserStats = getUserStats;
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.default.find().select("-password"); // استبعاد كلمة المرور
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب المستخدمين." });
    }
};
exports.getAllUsers = getAllUsers;
// إنشاء مستخدم جديد
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // التحقق من وجود المستخدم
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res
                .status(400)
                .json({ message: "البريد الإلكتروني مستخدم بالفعل." });
        }
        // تشفير كلمة المرور
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // إنشاء المستخدم
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        res.status(201).json({ message: "تم إنشاء المستخدم بنجاح.", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء إنشاء المستخدم." });
    }
};
exports.createUser = createUser;
// تحديث مستخدم موجود
const updateUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userId = req.params.id;
        // التحقق من وجود المستخدم
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
            return;
        }
        // تحديث البيانات
        user.name = name;
        user.email = email;
        user.role = role;
        // تحديث كلمة المرور إذا تم إرسالها
        if (password) {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        await user.save();
        res.status(200).json({ message: "تم تحديث المستخدم بنجاح.", user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء تحديث المستخدم." });
    }
};
exports.updateUser = updateUser;
// حذف مستخدم
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        // التحقق من وجود المستخدم
        const user = await User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود." });
        }
        await User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "تم حذف المستخدم بنجاح." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء حذف المستخدم." });
    }
};
exports.deleteUser = deleteUser;
