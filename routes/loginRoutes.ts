import { Router, Request, Response } from "express"
import { compare } from "bcrypt"
import * as UserService from "../service/users.service"
import { UserReqBody } from "../models/body"

const login = Router()

login.post('/api/login', async (req: Request<{}, {}, UserReqBody, {}>, res: Response) => {
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

export { login }