import { Request, Response } from "express"
import RoomService from "../../../app/services/room/index"
import { DepsTypes } from "../../types"

const createRouter = (deps: DepsTypes) => {
  const authService = new RoomService(deps) 
  
  return async (req: Request, res: Response) => {
    const room = await authService.create(req)

    return res.status(200).json(room)
  }
}

export default createRouter