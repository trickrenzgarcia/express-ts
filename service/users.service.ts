import { UserQueries } from "../models/users/users.queries";
import { execute } from "../utils/mysql.connector";
import { IUsers } from "../models/users/users.model";

const getUsers = async () => {
  return execute<IUsers>(UserQueries.GetUsers, {})
}

const getUserById = async (id: IUsers['uid']) => {
  return execute<IUsers>(UserQueries.GetUserById, [id])
}

const getUserPasswordByEmail = async (email: IUsers['email']) => {
  return execute<IUsers>(UserQueries.GetUserPasswordByEmail, [email])
}

const addUser = async (uid: IUsers['uid'], username: IUsers['username'], email: IUsers['email'], password: IUsers['password']) => {
  return execute<IUsers>(UserQueries.AddUser, [uid, username, email, password])
}

export { 
  getUsers, 
  getUserById,
  getUserPasswordByEmail,
  addUser
}