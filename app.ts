import express, { Application, Response, Request, NextFunction } from 'express'
import { UserReqBody, UserResBody, UserParams, UserReqQuery } from './models/body'
import helmet from 'helmet'
import cors from 'cors'
import * as MySQLConnector from './utils/mysql.connector'
import { hash, compare } from 'bcrypt'

//Services
import * as UserService from './service/users.service'
import { IUsers } from './models/users/users.model'

const app: Application = express()

const SERVER: string = 'localhost'
const PORT: number = 5000

// make your json prettier
app.set('json spaces', 2)

// adding set of security middlewares
app.use(helmet())

// parse incoming request body and append data to `req.body`
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// enable all CORS request
app.use(cors())

// create database pool
MySQLConnector.init()

//Middlewares
const middleware = ({name} : {name: string}) => (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  res.locals.name = name

  next()
}

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await UserService.getUsers()

    res.status(200).json(users)
  } catch (error) {
    console.error('[teams.controller][getTeams][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
    res.status(500).json({
      message: 'There was an error when fetching users'
    });
  }
})

app.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const uid = req.params.id
    const user = await UserService.getUserById(uid)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({
      message: 'There was an error when fetching users'
    })
  }
})


app.post('/api/login', async (req: Request<{}, {}, UserReqBody, {}>, res: Response) => {
  const { email, password } = req.body
  try {
    const userPass = await UserService.GetUserPasswordByEmail(email)
    
    // @ts-ignore
    compare(password, userPass[0].password, (err, result) => {
      if(result) res.send("Successfully Logged In!")
      else res.send("Wrong email or password")
    })
    
  } catch (error) {

  }

})

app.post('/api/signup', (req: Request<UserParams, UserResBody, UserReqBody, UserReqQuery>, res: Response) => {
  const { email, username, password } = req.body
  res.json({
    username: username
  })
})

app.listen(PORT, SERVER, () => {
  console.log(`Server is running, listening at http://${SERVER}:${PORT}`)
})