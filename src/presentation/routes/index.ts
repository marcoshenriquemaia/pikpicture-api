import { Router } from "express"
import { DepsTypes } from "../types"
import roomRouter from "./room/index"

const routes = (deps: DepsTypes) => {
  const routes = Router()

  routes.use('/room', roomRouter(deps))

  return routes
}

export default routes