"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // عنوان الـ Frontend
}));
// Middleware للمصادقة
const authenticate = (requiredRole) => {
    return async (req, res, next) => {
        try {
            // استخراج الـ Token من الـ Headers
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                res.status(401).json({ message: "Unauthorized: No token provided" });
                return;
            }
            // التحقق من صلاحية الـ Token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // تخزين بيانات المستخدم في الـ Request
            req.user = decoded;
            // التحقق من الصلاحيات
            if (decoded.role !== requiredRole && decoded.role !== "super-admin") {
                res
                    .status(403)
                    .json({ message: "Forbidden: Insufficient permissions" });
                return;
            }
            // استدعاء الوظيفة التالية في السلسلة
            next();
        }
        catch (err) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};
exports.authenticate = authenticate;
