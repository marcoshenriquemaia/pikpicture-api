import { Router } from "express"
import { DepsTypes } from "../../types"
import createRouter from "./create.routes"

const roomRouter = (deps: DepsTypes) => {
  const router = Router()

  router.post('/create', createRouter(deps))
  
  return router
}

export default roomRouter