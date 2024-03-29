import express, { Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes'
import { DataBaseType } from '../data'
import { EnvTypes } from '../@types/env.types'
import errorCatcher from '../errors'
import RoomQueue from '../queue'

export interface ConfigureAppType{
  models: DataBaseType
  ENV: EnvTypes
  roomQueue: RoomQueue
} 

const configureApp = ({ models, ENV, roomQueue }: ConfigureAppType) => {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(morgan('dev'))
  app.use(routes({ models, roomQueue }))

  app.get('/ping', (_: any, res: Response) => res.send('PONG'))

  errorCatcher(app)

  return app
}

export default configureApp