import { Router, Request, Response } from "express"
import { hash, compare } from "bcrypt"
import * as UserService from "../../service/users.service"
import { UserReqBody } from "../../models/body"
import { v4 } from "uuid"
import { verify } from 'hcaptcha'

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

app.post('/api/captcha', async (req: Request, res: Response) => {
  if(!req.body.captcha){
    return res.status(400).json({ message: 'Captcha token is missing!' })
  }
  
  try {
    const response = await fetch(`https://hcaptcha.com/siteverify`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: `response=${req.body.captcha}&secret=0x3Ad959C49817E0dd14cBeE40045791d3ec76f0Af`,
      method: 'POST'
    })

    const captchaValidation = await response.json()

    if(captchaValidation.success) {
      console.log("OKKK")
      return res.status(200).send('OK')
    }

    return res.status(422).json({
      message: 'Unproccesable request, Invalid captcha!'
    })

  } catch (error) {
    return res.status(422).json({ message: error })
  }
})
.all('/api/captcha', (req: Request, res: Response) => {
  if(req.method !== 'POST'){
    res.status(405).json({
      message: `Method [${req.method}] not allowed.`,
      statusCode: 405
    })
  }
})

export { app as apiRoutes }