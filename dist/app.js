"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// البنية النهائية بعد التعديلات
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("./models/User"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const serverRoutes_1 = __importDefault(require("./routes/serverRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const itemRoutes_1 = __importDefault(require("./routes/itemRoutes"));
// التهيئة الأولية
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
// الاتصال بقاعدة البيانات
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("🛢️  تم الاتصال مع قاعدة البيانات بنجاح");
        await createSuperAdmin();
    }
    catch (error) {
        console.error("❌ فشل الاتصال مع قاعدة البيانات:", error);
        process.exit(1);
    }
};
// تشغيل الخادم
const startServer = () => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    });
};
// التسلسل الزمني للتشغيل
(async () => {
    await connectDB();
    startServer();
})();
const createSuperAdmin = async () => {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdmin = await User_1.default.findOne({ email: superAdminEmail });
    if (!superAdmin) {
        const hashedPassword = await bcryptjs_1.default.hash(superAdminPassword, 10);
        await User_1.default.create({
            email: superAdminEmail,
            password: hashedPassword,
            role: "super-admin",
        });
        console.log("Super Admin created successfully");
    }
};
createSuperAdmin();
connectDB();
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/category", serverRoutes_1.default);
app.use("/api/items", itemRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRouter_1.default);
app.use("/api", uploadRoutes_1.default);
