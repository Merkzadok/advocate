import { Task } from "@/mongoose/Task";

interface UpdateTaskArgs {
  id: string;
  userId: string;
  taskName?: string;
  description?: string;
  priority?: number;
  tags?: string[];
  isDone?: boolean;
}

export const updateTask = async (_: any, args: UpdateTaskArgs) => {
  const { id, userId, ...updates } = args;

  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  if (task.userId.toString() !== userId) {
    throw new Error("Unauthorized: You can only update your own tasks.");
  }

  // Validations
  if (updates.priority && (updates.priority < 1 || updates.priority > 5)) {
    throw new Error("Priority must be between 1 and 5.");
  }
  if (updates.taskName && updates.taskName === updates.description) {
    throw new Error("Description cannot be the same as taskName.");
  }
  if (updates.tags && updates.tags.length > 5) {
    throw new Error("Tags cannot exceed 5.");
  }

  Object.assign(task, updates, { updatedAt: new Date() });
  return await task.save();
};
