import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // عنوان الـ Frontend
  })
);

// واجهة للبيانات التي يتم إرجاعها من JWT
interface IDecodedToken {
  userId: string;
  role: "user" | "admin" | "super-admin";
}

// توسيع واجهة Request لإضافة خاصية user
declare global {
  namespace Express {
    interface Request {
      user?: IDecodedToken; // بيانات المستخدم بعد فك الـ Token
    }
  }
}

// Middleware للمصادقة
export const authenticate = (
  requiredRole: "user" | "admin" | "super-admin"
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // استخراج الـ Token من الـ Headers
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      // التحقق من صلاحية الـ Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IDecodedToken;

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
    } catch (err) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};
