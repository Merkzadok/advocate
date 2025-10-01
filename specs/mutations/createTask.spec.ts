// specs/mutations/createTask.spec.ts
jest.mock("@/mongoose/Task");

import { addTask } from "@/graphql/resolvers/task/mutations/createTask";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("addTask Mutation", () => {
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

    const result = await addTask({}, args);

    expect(result).toEqual(mockTaskData);
    expect(MockedTask.findOne).toHaveBeenCalledWith({
      taskName: args.taskName,
      userId: args.userId,
    });
  });

  it("should throw if description < 10 chars", async () => {
    await expect(
      addTask(
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
      addTask(
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
      addTask(
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
      addTask(
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
      addTask(
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
