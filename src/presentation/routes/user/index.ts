import { Router } from "express"
import { DepsTypes } from "../../types"
import upsertRouter from "./upsert.routes"

const userRouter = (deps: DepsTypes) => {
  const router = Router()

  router.put('/upsert', upsertRouter(deps))
  
  return router
}

export default userRouter