import { Request, Response } from "express"
import RoomService from "../../../app/services/room/index"
import AppError from "../../../errors/AppError"
import { DepsTypes } from "../../types"

const joinRouter = (deps: DepsTypes) => {
  const roomService = new RoomService(deps) 
  
  return async (req: Request, res: Response) => {
    const { room, player } = req.body

    const updatedRoom = await roomService.joinPlayer({ room, player, returnCurrent: true })

    if (!updatedRoom) throw new AppError('Could not join')

    return res.status(200).json(updatedRoom)
  }
}

export default joinRouter