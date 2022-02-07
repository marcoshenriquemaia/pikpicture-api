import RoomService from "../../../../app/services/room"
import { DepsTypes } from "../../../../presentation/types"
import RoomQueue from "../../../../queue"
import verifyPlay from "../../helpers/verifyPlay"
import { DataPlayTypes } from "./types"

const play = (socket: any, deps: DepsTypes, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps)
  return ({ room, play }: DataPlayTypes) => {
    roomQueue.createQueue(`catching_play_${room}`)
    roomQueue.enqueue(`catching_play_${room}`, async (queueResolver: Function, taskQuantity: number) => {
      const currentRoom = await roomService.getByHash(room)

      const won = verifyPlay({ play, currentCard: currentRoom.currentCard })

      if (won) {
        const updatedRoom = await roomService.catching_won({ socketId: socket.id })
        io.sockets.in(room).emit('catching_won')
      }

      console.log('won', won);

      queueResolver && queueResolver()
    })
  }
}

export default play