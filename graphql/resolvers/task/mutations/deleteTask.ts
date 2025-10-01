import { Task } from "@/mongoose/Task";

export const deleteTask = async (_: any, { id }: { id: string }) => {
  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  task.deleted = true;
  await task.save();

  return { success: true, message: `Task with id ${id} has been deleted.` };
};
