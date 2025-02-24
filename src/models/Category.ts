import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string; // اسم السيرفر
  image: string; // رابط صورة السيرفر
  createdAt: Date; // تاريخ إنشاء السيرفر
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  image: { type: String},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICategory>("Category", categorySchema);
