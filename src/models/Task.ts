import { Schema, model, Document } from "mongoose";

// Define the interface for Task
export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema
const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Export the model
export default model<ITask>("Task", TaskSchema);
