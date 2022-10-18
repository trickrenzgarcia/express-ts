import { UserQueries } from "../models/users/users.queries";
import { execute } from "../utils/mysql.connector";
import { IUsers } from "../models/users/users.model";

export const getUsers = async () => {
  return execute<IUsers>(UserQueries.GetUsers, {})
}