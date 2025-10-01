// specs/mutations/updateTask.spec.ts
jest.mock("@/mongoose/Task");

import { updateTask } from "@/graphql/resolvers/task/mutations/updateTask";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("updateTask Mutation", () => {
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

  it("should update a task if user owns it", async () => {
    const updates = { taskName: "Updated Task", priority: 4 };
    const mockSave = jest
      .fn()
      .mockResolvedValue({ ...mockTaskData, ...updates });
    const taskWithSave = { ...mockTaskData, save: mockSave };
    MockedTask.findById = jest.fn().mockResolvedValue(taskWithSave);

    const result = await updateTask(
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
      updateTask({}, { id: "1", userId: "wrongUser", taskName: "Test" })
    ).rejects.toThrow("Unauthorized: You can only update your own tasks.");
  });

  it("should throw if task not found", async () => {
    MockedTask.findById = jest.fn().mockResolvedValue(null);

    await expect(
      updateTask({}, { id: "nope", userId: "user1" })
    ).rejects.toThrow("Task not found");
  });

  it("should throw if priority invalid", async () => {
    MockedTask.findById = jest.fn().mockResolvedValue({
      ...mockTaskData,
      userId: "user1",
      save: jest.fn(),
    });

    await expect(
      updateTask({}, { id: "1", userId: "user1", priority: 10 })
    ).rejects.toThrow("Priority must be between 1 and 5.");
  });

  it("should throw if tags > 5", async () => {
    MockedTask.findById = jest.fn().mockResolvedValue({
      ...mockTaskData,
      userId: "user1",
      save: jest.fn(),
    });

    await expect(
      updateTask(
        {},
        { id: "1", userId: "user1", tags: ["1", "2", "3", "4", "5", "6"] }
      )
    ).rejects.toThrow("Tags cannot exceed 5.");
  });

  it("should throw if taskName === description in update", async () => {
    const sameName = "Same Name and Description";
    MockedTask.findById = jest.fn().mockResolvedValue({
      ...mockTaskData,
      userId: "user1",
      save: jest.fn(),
    });

    await expect(
      updateTask(
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
