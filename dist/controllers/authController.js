"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// تسجيل مستخدم جديد
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // التحقق مما إذا كان المستخدم موجودًا بالفعل
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // تشفير كلمة المرور
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // إنشاء المستخدم الجديد
        const newUser = new User_1.default({
            email,
            password: hashedPassword,
            role: role || "user", // الافتراضي هو "user"
        });
        await newUser.save();
        // إنشاء JWT Token
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ message: "User registered successfully", token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
// تسجيل الدخول
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // التحقق من وجود المستخدم
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res
                .status(400)
                .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
            return;
        }
        // التحقق من كلمة المرور
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res
                .status(400)
                .json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة." });
            return;
        }
        // إنشاء JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({ token, role: user.role });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول." });
    }
};
exports.login = login;
