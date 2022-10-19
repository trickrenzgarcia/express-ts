import { Router, Request, Response } from "express"
import { hash, compare } from "bcrypt"
import * as UserService from "../../service/users.service"
import { UserReqBody } from "../../models/body"
import { v4 } from "uuid"

const app = Router()

app.post('/api/login', async (req: Request<{}, {}, UserReqBody, {}>, res: Response) => {
  const { email, password } = req.body
  try {
    const userPass = await UserService.getUserPasswordByEmail(email)
    
    // @ts-ignore
    compare(password, userPass[0].password, (err, result) => {
      if(result) res.send("Successfully Logged In!")
      else res.send("Wrong email or password")
    })
    
  } catch (error) {
    res.json({ message: error })
  }
  
})

app.post('/api/signup', async (req: Request<{}, {}, UserReqBody, {}>, res: Response) => {
  const { username, email, password } = req.body
  try {
    hash(password, 10, async (err, hashed) => {
      if (err) throw new Error("something wrong! try again")
      const user = await UserService.addUser(v4(), username, email, hashed)
      res.json({ message: "1 user successfully created!", user: user})
    })
    
  } catch (error) {
    res.json({ message: error })
  }
})

export { app as apiRoutes }