import { Task } from "@/mongoose/Task";

export const addTask = async (
  _: any,
  { taskName, description, priority, tags = [], userId }: any
) => {
  if (description.length < 10) {
    throw new Error("Description must be at least 10 characters long.");
  }
  if (taskName === description) {
    throw new Error("Description cannot be the same as taskName.");
  }
  if (priority < 1 || priority > 5) {
    throw new Error("Priority must be between 1 and 5.");
  }
  if (tags.length > 5) {
    throw new Error("Tags cannot exceed 5.");
  }

  const existing = await Task.findOne({ taskName, userId });
  if (existing) {
    throw new Error("Task name must be unique per user.");
  }

  const now = new Date();
  const task = new Task({
    taskName,
    description,
    priority,
    tags,
    userId,
    isDone: false,
    createdAt: now,
    updatedAt: now,
  });

  return await task.save();
};
