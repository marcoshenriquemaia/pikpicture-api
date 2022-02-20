import { Request, Response } from "express"
import RoomService from "../../../app/services/room/index"
import { DepsTypes } from "../../types"

const gameModeRouter = (deps: DepsTypes) => {
  const roomService = new RoomService(deps) 
  
  return async (req: Request, res: Response) => {
    const room = await roomService.changeGameMode(req)

    return res.status(200).json(room)
  }
}

export default gameModeRouter