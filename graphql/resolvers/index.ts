import { Task } from "@/mongoose/Task";
import { sayHello } from "./mutations/say-hello";
import { helloQuery } from "./queries/hello-query";
import { taskResolvers } from "./task";

export const resolvers = {
  Query: {
    helloQuery,
  },
  Task: taskResolvers.Query,
  Mutation: {
    sayHello,
  },
};
