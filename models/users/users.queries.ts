export const UserQueries = {
  GetUsers: `
  SELECT uid, username, email FROM users
  `,
  GetUserById: `
  SELECT uid, username, email FROM users WHERE uid = ?
  `,
  GetUserPasswordByEmail: `
  SELECT password FROM users WHERE email = ?
  `,
  AddUser: `
  INSERT INTO users (username, email, password) VALUES (?, ?, ?);
  `,
  UpdateUserById: `
  UPDATE users SET username = ?, email = ?, password = ? WHERE uid = ?
  `,
  DeleteUsersById: `
  DELETE FROM users WHERE uid = ?
  `
}