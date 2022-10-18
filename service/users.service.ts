import { UserQueries } from "../models/users/users.queries";
import { execute } from "../utils/mysql.connector";
import { IUsers } from "../models/users/users.model";

export const getUsers = async () => {
  return execute<IUsers>(UserQueries.GetUsers, {})
}

export const getUserById = async (id: IUsers['uid']) => {
  return execute<IUsers>(UserQueries.GetUserById, [id])
}

export const GetUserPasswordByEmail = async (email: IUsers['email']) => {
  return execute<IUsers>(UserQueries.GetUserPasswordByEmail, [email])
}