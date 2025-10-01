import { helloQuery } from "@/graphql/resolvers/task/queries/hello-query";

describe("Hello Query", () => {
  it("Should call hello query", () => {
    expect(helloQuery()).toBeDefined();
  });
});
