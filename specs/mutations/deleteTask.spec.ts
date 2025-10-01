// specs/mutations/deleteTask.spec.ts
jest.mock("@/mongoose/Task");

import { deleteTask } from "@/graphql/resolvers/task/mutations/deleteTask";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("deleteTask Mutation", () => {
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

  it("should mark task as deleted", async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const deletableTask = { ...mockTaskData, save: mockSave };
    MockedTask.findById = jest.fn().mockResolvedValue(deletableTask);

    const result = await deleteTask({}, { id: "1" });

    expect(result).toEqual({
      success: true,
      message: "Task with id 1 has been deleted.",
    });
    expect(mockSave).toHaveBeenCalled();
    expect(deletableTask.deleted).toBe(true);
  });

  it("should throw if task not found", async () => {
    MockedTask.findById = jest.fn().mockResolvedValue(null);

    await expect(deleteTask({}, { id: "1" })).rejects.toThrow("Task not found");
  });
});
