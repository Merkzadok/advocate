import { Task } from "@/mongoose/Task";

export const getAllTasks = async () => {
  return await Task.find({ deleted: false });
};
