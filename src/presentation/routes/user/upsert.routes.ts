import { Request, Response } from "express"
import UserService from "../../../app/services/user"
import { DepsTypes } from "../../types"

const upsertRouter = (deps: DepsTypes) => {
  const userService = new UserService(deps) 
  
  return async (req: Request, res: Response) => {
    const user = await userService.upsert(req)

    return res.status(200).json(user)
  }
}

export default upsertRouter