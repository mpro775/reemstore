import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super-admin";
}

const userSchema = new Schema<IUser>({
  name: { type: String}, // الحقل مطلوب
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "user",
  },
});



export default mongoose.model<IUser>("User", userSchema);
