import { Router } from "express"
import { DepsTypes } from "../types"
import roomRouter from "./room/index"
import userRouter from "./user"

const routes = (deps: DepsTypes) => {
  const routes = Router()

  routes.use('/room', roomRouter(deps))
  routes.use('/user', userRouter(deps))

  return routes
}

export default routes