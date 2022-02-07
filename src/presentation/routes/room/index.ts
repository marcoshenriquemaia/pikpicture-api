import { Router } from "express"
import { DepsTypes } from "../../types"
import createRouter from "./create.routes"
import joinRouter from "./join.routes"

const roomRouter = (deps: DepsTypes) => {
  const router = Router()

  router.post('/create', createRouter(deps))
  router.put('/join', joinRouter(deps))
  
  return router
}

export default roomRouter