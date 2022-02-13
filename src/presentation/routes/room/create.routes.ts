import { Request, Response } from "express"
import RoomService from "../../../app/services/room/index"
import { DepsTypes } from "../../types"

const createRouter = (deps: DepsTypes) => {
  const roomService = new RoomService(deps) 
  
  return async (req: Request, res: Response) => {
    const room = await roomService.create(req, deps.roomQueue)

    return res.status(200).json(room)
  }
}

export default createRouter