import 'express-async-errors'
import dotenv from 'dotenv'
import { EnvTypes } from './@types/env.types'
import configureDatabase from './data'
import configureApp from './presentation/app'
import configureSocket from './socket'
import RoomQueue from './queue'

dotenv.config()

async function run(){
  const ENV: EnvTypes = {
    PORT: process.env.PORT,
    DB_CONNECTION: process.env.DB_CONNECTION
  }

  const roomQueue = new RoomQueue()

  const models = await configureDatabase({ ENV })

  const app = configureApp({ models, ENV, roomQueue })

  const server = configureSocket(app, { models, roomQueue })

  server.listen(ENV.PORT ?? 3333, () => console.log(`🚀 Server started on port ${ENV.PORT}`))
}

run()