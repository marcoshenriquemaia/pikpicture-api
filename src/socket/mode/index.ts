import RoomService from "../../app/services/room"
import { GAME, ROOM, USER } from "../../mock/events"
import { DepsTypes } from "../../presentation/types"
import RoomQueue from "../../queue"

const modeRoom = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  return async (data: any) => {
    roomQueue.enqueue(`changeMode_${data.room}`, async (queueResolver: Function) => {
      await io.sockets.in(data.room).emit(ROOM.CHANGE_MODE, { mode: data.mode } )

      await queueResolver()
    })
  }
}

export default modeRoom