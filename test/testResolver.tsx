import { taskResolvers } from "@/graphql/resolvers/Task";
import { Task } from "@/mongoose/Task";

// Mock the Task model so we don’t use real MongoDB
jest.mock("@/mongoose/Task");

describe("Task Resolvers", () => {
  afterEach(() => {
    jest.clearAllMocks(); // reset mocks after each test
  });

  it("should add a new task", async () => {
    const input = { title: "Test Task", description: "Test Desc" };

    const saveMock = jest.fn().mockResolvedValue({
      _id: "1",
      title: input.title,
      description: input.description,
      completed: false,
      deleted: false,
    });

    // Mock Task constructor
    (Task as any).mockImplementation(() => ({ save: saveMock }));

    const result = await taskResolvers.Mutation.addTask({}, { input });

    expect(result._id).toBe("1");
    expect(result.title).toBe("Test Task");
    expect(saveMock).toHaveBeenCalled();
  });

  it("should get all tasks", async () => {
    const mockTasks = [
      { _id: "1", title: "Task 1" },
      { _id: "2", title: "Task 2" },
    ];

    (Task.find as any) = jest.fn().mockResolvedValue(mockTasks);

    const result = await taskResolvers.Query.getAllTasks();

    expect(result.length).toBe(2);
    expect(result[0].title).toBe("Task 1");
  });

  it("should delete a task", async () => {
    (Task.findByIdAndDelete as any) = jest
      .fn()
      .mockResolvedValue({ _id: "123", title: "Old Task" });

    const result = await taskResolvers.Mutation.deleteTask({}, { id: "123" });

    expect(result).toBe("Task with id 123 has been deleted.");
  });

  it("should return error if task not found on delete", async () => {
    (Task.findByIdAndDelete as any) = jest.fn().mockResolvedValue(null);

    const result = await taskResolvers.Mutation.deleteTask({}, { id: "999" });

    expect(result).toBe("Task is not found");
  });
});
