import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  taskName: string;
  description: string;
  isDone: boolean;
  deleted: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const TaskSchema: Schema<ITask> = new Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String, required: true },
    isDone: { type: Boolean, default: false, required: true },
    deleted: { type: Boolean, default: false, required: true },
    priority: { type: Number, required: false, min: 1, max: 5 },
    tags: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 5, "Max 5 tags allowed"],
    },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

TaskSchema.index({ taskName: 1, userId: 1 }, { unique: true });

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
