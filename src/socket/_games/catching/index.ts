import { DepsTypes } from "../../../presentation/types"
import RoomQueue from "../../../queue"
import play from "./play"

const catchingMode = (socket: any, deps: DepsTypes, roomQueue: RoomQueue, io: any) => {
  socket.on('catching_play', play(socket, deps, roomQueue, io))
}

export default catchingMode