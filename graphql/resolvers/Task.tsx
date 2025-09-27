import { Task } from "@/mongoose/Task";

export const taskResolvers = {
  Query: {
    getAllTasks: async () => {
      return await Task.find({ deleted: false });
    },
    getFinishedTasksLists: async () => {
      return await Task.find({ deleted: true });
    },
    getTaskById: async (_: any, { id }: { id: string }) => {
      return await Task.findById(id);
    },
  },

  Mutation: {
    addTask: async (
      _: any,
      { input }: { input: { title: string; description?: string } }
    ) => {
      const task = new Task({ ...input });
      return await task.save();
    },
    updateTask: async (
      _: any,
      {
        input,
      }: {
        input: {
          id: string;
          title?: string;
          description?: string;
          completed?: boolean;
          deleted?: boolean;
        };
      }
    ) => {
      const task = await Task.findById(input.id);
      if (!task) throw new Error("Task not found");

      Object.assign(task, input);
      return await task.save();
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      const task = await Task.findById(id);
      if (!task) throw new Error("Task not found");

      task.deleted = true;
      await task.save();

      return { success: true, message: `Task with id ${id} has been deleted.` };
    },
  },
};
