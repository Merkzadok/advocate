// specs/queries/getTaskById.spec.ts
jest.mock("@/mongoose/Task");

import { getTaskById } from "@/graphql/resolvers/task/queries/getTaskById";
import { Task } from "@/mongoose/Task";

const MockedTask = Task as jest.MockedClass<typeof Task>;

describe("getTaskById Query", () => {
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

  it("should return a task by id", async () => {
    MockedTask.findById = jest.fn().mockResolvedValue(mockTaskData);

    const result = await getTaskById({}, { id: "1" });

    expect(result).toEqual(mockTaskData);
    expect(MockedTask.findById).toHaveBeenCalledWith("1");
  });
});
