import mongoose, { Document, Schema } from "mongoose";

export interface Iitem extends Document {
  name: string; // اسم السيرفر
  image: string; // رابط صورة السيرفر
  createdAt: Date; // تاريخ إنشاء السيرفر
}

const itemSchema = new Schema<Iitem>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<Iitem>("Item", itemSchema);
