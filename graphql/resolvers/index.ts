import { taskResolvers } from "./task/index";

export const resolvers = {
  Query: {
    ...taskResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
  },
};
