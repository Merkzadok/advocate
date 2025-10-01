import { Task } from "@/mongoose/Task";

export const getTaskById = async (_: any, { id }: { id: string }) => {
  return await Task.findById(id);
};
