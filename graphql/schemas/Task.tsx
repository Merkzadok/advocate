import { gql } from "graphql-tag";

export const taskTypeDefs = gql`
  type Task {
    _id: ID!
    taskName: String!
    description: String!
    isDone: Boolean!
    priority: Int!
    tags: [String!]
    createdAt: String!
    updatedAt: String!
    userId: String!
  }
  type DeleteTaskResponse {
    success: Boolean!
    message: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
  }

  extend type Query {
    getAllTasks: [Task!]!
    getTaskById(id: ID!): Task
    getUserDoneTasksLists(userId: ID!): [Task!]!
    getFinishedTasksLists: [Task!]!
  }

  extend type Mutation {
    addTask(
      taskName: String!
      description: String!
      priority: Int!
      tags: [String!]
      userId: String!
    ): Task!

    updateTask(
      id: ID!
      taskName: String
      description: String
      priority: Int
      isDone: Boolean
      tags: [String!]
      userId: String!
    ): Task!
    deleteTask(id: ID!): DeleteTaskResponse!
  }
`;
