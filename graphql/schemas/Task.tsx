import { gql } from "graphql-tag";

export const taskTypeDefs = gql`
  type Task {
    _id: ID!
    title: String!
    description: String
    completed: Boolean!
    deleted: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input AddTaskInput {
    title: String!
    description: String
  }

  input UpdateTaskInput {
    id: ID!
    title: String
    description: String
    completed: Boolean
    deleted: Boolean
  }

  type Query {
    getAllTasks: [Task!]!
    getFinishedTasksLists: [Task!]!
  }

  type Mutation {
    addTask(input: AddTaskInput!): Task!
    updateTask(input: UpdateTaskInput!): Task!
  }
`;
