import { getAllTasks } from "./getAllTasks";
import { getTaskById } from "./getTaskById";
import { getFinishedTasks } from "./getFinishedTasks";
import { helloQuery } from "./hello-query";

export const taskQueries = {
  getAllTasks,
  getTaskById,
  getFinishedTasksLists: getFinishedTasks, // Map the correct name here
  helloQuery,
};
