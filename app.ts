import express, { Application, Response, Request, NextFunction } from 'express'
import { UserReqBody, UserResBody, UserParams, UserReqQuery } from './models/body'
import helmet from 'helmet'
import cors from 'cors'
import * as MySQLConnector from './utils/mysql.connector'

//Services
import * as UserService from './service/users.service'

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



app.post('/api/signup', (req: Request<UserParams, UserResBody, UserReqBody, UserReqQuery>, res: Response) => {
  const { email, username, password } = req.body
  res.json({
    username: username
  })
})

app.listen(PORT, SERVER, () => {
  console.log(`Server is running, listening at http://${SERVER}:${PORT}`)
})