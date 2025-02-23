import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string; // اسم الباقة
  description: string; // وصف طويل للباقة
  category: mongoose.Types.ObjectId; // ربط مع نموذج السيرفر (Server)
  item: mongoose.Types.ObjectId; // ربط مع نموذج السيرفر (Server)
  price: number; // السعر الأساسي
  discountedPrice?: number; // السعر بعد الخصم (اختياري)
  image: string; // رابط صورة المنتج
  createdBy: mongoose.Types.ObjectId; // الشخص أو المشرف الذي أنشأ المنتج
  createdAt: Date; // تاريخ إنشاء المنتج
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // ربط مع نموذج السيرفر
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true }, // ربط مع نموذج السيرفر
  price: { type: Number, required: true },
  discountedPrice: { type: Number, default: null }, // السعر بعد الخصم (اختياري)
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>("Product", productSchema);
