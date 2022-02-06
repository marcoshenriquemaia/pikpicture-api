import 'express-async-errors'
import dotenv from 'dotenv'
import { EnvTypes } from './@types/env.types'
import configureDatabase from './data'
import configureApp from './presentation/app'
import configureSocket from './socket'

dotenv.config()

async function run(){
  const ENV: EnvTypes = {
    PORT: process.env.PORT,
    DB_CONNECTION: process.env.DB_CONNECTION
  }

  const models = await configureDatabase({ ENV })

  const app = configureApp({ models, ENV })

  const server = configureSocket(app, { models })

  server.listen(ENV.PORT ?? 3333, () => console.log(`🚀 Server started on port ${ENV.PORT}`))
}

run()