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

  describe("Query.getTaskById", () => {
    it("should return a task by id", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(mockTaskData);
      const result = await taskResolvers.Query.getTaskById({}, { id: "1" });
      expect(result).toEqual(mockTaskData);
      expect(MockedTask.findById).toHaveBeenCalledWith("1");
    });
  });

  // ------------------------
  // Mutation tests
  // ------------------------
  describe("Mutation.addTask", () => {
    it("should add a new task", async () => {
      MockedTask.findOne = jest.fn().mockResolvedValue(null);
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

    it("should throw if description < 10 chars", async () => {
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

    it("should throw if taskName === description", async () => {
      const longSame = "ABCDEFGHIJKL"; // >=10 chars
      await expect(
        taskResolvers.Mutation.addTask(
          {},
          {
            taskName: longSame,
            description: longSame,
            priority: 3,
            tags: [],
            userId: "user1",
          }
        )
      ).rejects.toThrow("Description cannot be the same as taskName.");
    });

    it("should throw if priority out of range", async () => {
      await expect(
        taskResolvers.Mutation.addTask(
          {},
          {
            taskName: "Test",
            description: "Valid description",
            priority: 6,
            userId: "user1",
          }
        )
      ).rejects.toThrow("Priority must be between 1 and 5.");
    });

    it("should throw if tags > 5", async () => {
      await expect(
        taskResolvers.Mutation.addTask(
          {},
          {
            taskName: "Test",
            description: "Valid description here",
            priority: 3,
            userId: "user1",
            tags: ["1", "2", "3", "4", "5", "6"],
          }
        )
      ).rejects.toThrow("Tags cannot exceed 5.");
    });

    it("should throw if task already exists", async () => {
      MockedTask.findOne = jest.fn().mockResolvedValue(mockTaskData);
      await expect(
        taskResolvers.Mutation.addTask(
          {},
          {
            taskName: "Test Task",
            description: "Valid description here",
            priority: 3,
            userId: "user1",
          }
        )
      ).rejects.toThrow("Task name must be unique per user.");
    });
  });

  describe("Mutation.updateTask", () => {
    it("should update a task if user owns it", async () => {
      const updates = { taskName: "Updated Task", priority: 4 };
      const mockSave = jest
        .fn()
        .mockResolvedValue({ ...mockTaskData, ...updates });
      const taskWithSave = { ...mockTaskData, save: mockSave };
      MockedTask.findById = jest.fn().mockResolvedValue(taskWithSave);

      const result = await taskResolvers.Mutation.updateTask(
        {},
        { id: "1", userId: "user1", ...updates }
      );
      expect(result.taskName).toBe(updates.taskName);
      expect(result.priority).toBe(updates.priority);
      expect(mockSave).toHaveBeenCalled();
    });

    it("should throw if userId does not match", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(mockTaskData);
      await expect(
        taskResolvers.Mutation.updateTask(
          {},
          { id: "1", userId: "wrongUser", taskName: "Test" }
        )
      ).rejects.toThrow("Unauthorized: You can only update your own tasks.");
    });

    it("should throw if task not found", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(null);
      await expect(
        taskResolvers.Mutation.updateTask({}, { id: "nope", userId: "user1" })
      ).rejects.toThrow("Task not found");
    });

    it("should throw if priority invalid", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue({
        ...mockTaskData,
        userId: "user1",
        save: jest.fn(),
      });
      await expect(
        taskResolvers.Mutation.updateTask(
          {},
          { id: "1", userId: "user1", priority: 10 }
        )
      ).rejects.toThrow("Priority must be between 1 and 5.");
    });

    it("should throw if tags > 5", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue({
        ...mockTaskData,
        userId: "user1",
        save: jest.fn(),
      });
      await expect(
        taskResolvers.Mutation.updateTask(
          {},
          { id: "1", userId: "user1", tags: ["1", "2", "3", "4", "5", "6"] }
        )
      ).rejects.toThrow("Tags cannot exceed 5.");
    });

    // NEW TEST - Covers line 71
    it("should throw if taskName === description in update", async () => {
      const sameName = "Same Name and Description";
      MockedTask.findById = jest.fn().mockResolvedValue({
        ...mockTaskData,
        userId: "user1",
        save: jest.fn(),
      });
      await expect(
        taskResolvers.Mutation.updateTask(
          {},
          {
            id: "1",
            userId: "user1",
            taskName: sameName,
            description: sameName,
          }
        )
      ).rejects.toThrow("Description cannot be the same as taskName.");
    });
  });

  describe("Mutation.deleteTask", () => {
    it("should mark task as deleted", async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      const deletableTask = { ...mockTaskData, save: mockSave };
      MockedTask.findById = jest.fn().mockResolvedValue(deletableTask);

      const result = await taskResolvers.Mutation.deleteTask({}, { id: "1" });
      expect(result).toEqual({
        success: true,
        message: "Task with id 1 has been deleted.",
      });
      expect(mockSave).toHaveBeenCalled();
      expect(deletableTask.deleted).toBe(true);
    });

    it("should throw if task not found", async () => {
      MockedTask.findById = jest.fn().mockResolvedValue(null);
      await expect(
        taskResolvers.Mutation.deleteTask({}, { id: "1" })
      ).rejects.toThrow("Task not found");
    });
  });

  // NEW TEST - Covers line 91 (duplicate getFinishedTasksLists in Mutation)
  describe("Mutation.getFinishedTasksLists", () => {
    it("should return all deleted tasks", async () => {
      MockedTask.find = jest
        .fn()
        .mockResolvedValue([{ ...mockTaskData, deleted: true }]);
      const result = await taskResolvers.Mutation.getFinishedTasksLists();
      expect(result).toEqual([{ ...mockTaskData, deleted: true }]);
      expect(MockedTask.find).toHaveBeenCalledWith({ deleted: true });
    });
  });
});
