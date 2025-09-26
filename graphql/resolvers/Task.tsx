import { Task } from "@/mongoose/Task";

export const taskResolvers = {
  Query: {
    getAllTasks: async () => {
      return await Task.find({ deleted: false });
    },
    getFinishedTasksLists: async () => {
      return await Task.find({ deleted: true });
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
  },
};
