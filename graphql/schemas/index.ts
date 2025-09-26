import { gql } from "graphql-tag";
import { taskTypeDefs } from "./Task";

export const typeDefs = gql`
  type Query {
    helloQuery: String
  }

  type Mutation {
    sayHello(name: String!): String
  }

  ${taskTypeDefs}
`;

export default typeDefs;
