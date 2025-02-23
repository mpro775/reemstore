// البنية النهائية بعد التعديلات
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import serverRoutes from "./routes/serverRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRouter";
import uploadRoutes from "./routes/uploadRoutes";
import itemRoutes from "./routes/itemRoutes";

// التهيئة الأولية
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'https://reemstore.store'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // إذا كنت تستخدم الكوكيز أو الجلسات
}));

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("🛢️  تم الاتصال مع قاعدة البيانات بنجاح");
    await createSuperAdmin();
  } catch (error) {
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

  const superAdmin = await User.findOne({ email: superAdminEmail });
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPassword as string, 10);
    await User.create({
      email: superAdminEmail,
      password: hashedPassword,
      role: "super-admin",
    });
    console.log("Super Admin created successfully");
  }
};

createSuperAdmin();

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", serverRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api", uploadRoutes);
app.use('/uploads', express.static('uploads'));
