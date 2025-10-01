jest.mock("@/mongoose/Task");

import { getAllTasks } from "@/graphql/resolvers/task/queries/getAllTasks";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("Query.getAllTasks", () => {
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
    };
  });

  it("should return all non-deleted tasks", async () => {
    MockedTask.find = jest.fn().mockResolvedValue([mockTaskData]);

    const result = await getAllTasks();
    expect(result).toEqual([mockTaskData]);
    expect(MockedTask.find).toHaveBeenCalledWith({ deleted: false });
  });
});
