import { Express, Request, Response } from 'express'
import AppError from './AppError'

const errorCatcher = (app: Express) => {
  app.use((err: any, __: Request, response: Response, _: any) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message
      })
    }
    
    console.error(err)

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  })
}

export default errorCatcher

