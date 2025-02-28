import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  refreshToken?: string; // Store refresh token in DB
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    refreshToken: { type: String }, // New field to store refresh token
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
