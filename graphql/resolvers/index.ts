import { taskResolvers } from "./Task";

export const resolvers = {
  Query: {
    ...taskResolvers.Query,
  },
  Mutation: {
    ...taskResolvers.Mutation,
  },
};
