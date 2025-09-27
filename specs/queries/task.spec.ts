// specs/queries/task.spec.ts
jest.mock("@/mongoose/Task");

import { taskResolvers } from "@/graphql/resolvers/Task";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("Task Resolvers", () => {
  let mockTaskData: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTaskData = {
      _id: "1",
      taskName: "Test Task",
      description: "This is a test task",
      priority: 3,
      tags: ["tag1"],
      isDone: false,
      deleted: false,
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
    };
  });

  // ------------------------
  // Query tests
  // ------------------------
  describe("Query.getAllTasks", () => {
    it("should return all non-deleted tasks", async () => {
      MockedTask.find = jest.fn().mockResolvedValue([mockTaskData]);

      const result = await taskResolvers.Query.getAllTasks();
      expect(result).toEqual([mockTaskData]);
      expect(MockedTask.find).toHaveBeenCalledWith({ deleted: false });
    });
  });

  describe("Query.getFinishedTasksLists", () => {
    it("should return all deleted tasks", async () => {
      MockedTask.find = jest
        .fn()
        .mockResolvedValue([{ ...mockTaskData, deleted: true }]);

      const result = await taskResolvers.Query.getFinishedTasksLists();
      expect(result).toEqual([{ ...mockTaskData, deleted: true }]);
      expect(MockedTask.find).toHaveBeenCalledWith({ deleted: true });
    });
  });

  // ------------------------
  // Mutation tests
  // ------------------------
  describe("Mutation.addTask", () => {
    it("should add a new task", async () => {
      MockedTask.findOne = jest.fn().mockResolvedValue(null);

      // Mock the constructor and save method
      const mockSave = jest.fn().mockResolvedValue(mockTaskData);
      MockedTask.mockImplementation(() => ({
        ...mockTaskData,
        save: mockSave,
      }));

      const args = {
        taskName: "Test Task",
        description: "This is a test task",
        priority: 3,
        tags: ["tag1"],
        userId: "user1",
      };

      const result = await taskResolvers.Mutation.addTask({}, args);
      expect(result).toEqual(mockTaskData);
      expect(MockedTask.findOne).toHaveBeenCalledWith({
        taskName: args.taskName,
        userId: args.userId,
      });
    });

    it("should throw error if description < 10 chars", async () => {
      await expect(
        taskResolvers.Mutation.addTask(
          {},
          {
            taskName: "Task",
            description: "short",
            priority: 3,
            tags: [],
            userId: "user1",
          }
        )
      ).rejects.toThrow("Description must be at least 10 characters long.");
    });
  });

  describe("Mutation.updateTask", () => {
    it("should update a task if user owns it", async () => {
      const updates = { taskName: "Updated Task", priority: 4 };
      const mockSave = jest
        .fn()
        .mockResolvedValue({ ...mockTaskData, ...updates });

      const taskWithSave = {
        ...mockTaskData,
        save: mockSave,
      };

      MockedTask.findById = jest.fn().mockResolvedValue(taskWithSave);

      const result = await taskResolvers.Mutation.updateTask(
        {},
        { id: "1", userId: "user1", ...updates }
      );

      expect(result.taskName).toBe(updates.taskName);
      expect(result.priority).toBe(updates.priority);
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw error if userId does not match", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(mockTaskData);
      await expect(
        taskResolvers.Mutation.updateTask(
          {},
          { id: "1", userId: "wrongUser", taskName: "Test" }
        )
      ).rejects.toThrow("Unauthorized: You can only update your own tasks.");
    });
  });

  describe("Mutation.deleteTask", () => {
    it("should mark task as deleted", async () => {
      // Create a mock task that can be modified
      const mockSave = jest.fn().mockResolvedValue(true);
      const deletableTask = {
        ...mockTaskData,
        save: mockSave,
      };

      MockedTask.findById = jest.fn().mockResolvedValue(deletableTask);

      const result = await taskResolvers.Mutation.deleteTask({}, { id: "1" });

      expect(result).toEqual({
        success: true,
        message: `Task with id 1 has been deleted.`,
      });
      expect(mockSave).toHaveBeenCalled();
      expect(deletableTask.deleted).toBe(true);
    });

    it("should throw error if task not found", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(null);
      await expect(
        taskResolvers.Mutation.deleteTask({}, { id: "1" })
      ).rejects.toThrow("Task not found");
    });
  });
});
