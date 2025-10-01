import { Task } from "@/mongoose/Task";

export const getFinishedTasks = async () => {
  return await Task.find({ deleted: true });
};
