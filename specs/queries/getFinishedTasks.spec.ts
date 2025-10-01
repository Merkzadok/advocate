// specs/queries/getFinishedTasks.spec.ts
jest.mock("@/mongoose/Task");

import { getFinishedTasks } from "@/graphql/resolvers/task/queries/getFinishedTasks";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("getFinishedTasksLists Query", () => {
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
      deleted: true,
      userId: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      save: jest.fn(),
    };
  });

  it("should return all deleted tasks", async () => {
    MockedTask.find = jest.fn().mockResolvedValue([mockTaskData]);

    const result = await getFinishedTasks();

    expect(result).toEqual([mockTaskData]);
    expect(MockedTask.find).toHaveBeenCalledWith({ deleted: true });
  });
});
