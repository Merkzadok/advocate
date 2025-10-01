import { taskMutations } from "./mutations";
import { taskQueries } from "./queries";

export const taskResolvers = {
  Query: taskQueries,
  Mutation: taskMutations,
};
