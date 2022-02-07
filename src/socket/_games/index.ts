import { DepsTypes } from "../../presentation/types"
import RoomQueue from "../../queue"
import catchingMode from "./catching"

const games = (socket: any, deps: DepsTypes, io: any) => {
  const roomQueue = new RoomQueue()

  catchingMode(socket, deps, roomQueue, io)
}

export default games