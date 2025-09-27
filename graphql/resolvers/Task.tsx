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
    },
    updateTask: async (_: any, { id, userId, ...updates }: any) => {
      // make sure user exists
      // const user = await User.findById(userId);
      // if (!user) throw new Error("User not found");

      const task = await Task.findById(id);
      if (!task) throw new Error("Task not found");

      // ownership check
      if (task.userId !== userId) {
        throw new Error("Unauthorized: You can only update your own tasks.");
      }

      // validations
      if (updates.priority && (updates.priority < 1 || updates.priority > 5)) {
        throw new Error("Priority must be between 1 and 5.");
      }
      if (updates.taskName && updates.taskName === updates.description) {
        throw new Error("Description cannot be the same as taskName.");
      }
      if (updates.tags && updates.tags.length > 5) {
        throw new Error("Tags cannot exceed 5.");
      }

      Object.assign(task, updates, { updatedAts: new Date() });
      return await task.save();
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      const task = await Task.findById(id);

      if (!task) throw new Error("Task not found");

      task.deleted = true;
      await task.save();

      return { success: true, message: `Task with id ${id} has been deleted.` };
    },
    getFinishedTasksLists: async () => {
      return await Task.find({ deleted: true });
    },
  },
};
