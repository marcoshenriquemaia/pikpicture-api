import { PlayerProps } from "../../../../@types/env.types"
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

      const player = currentRoom.playerList.find((item: PlayerProps) => {
        return item.socketId === socket.id
      })

      if (player.punishmentTime && (new Date(player.punishmentTime).getTime() > new Date().getTime())) return await queueResolver()

      const won = verifyPlay({ play, currentCard: player.card })

      if (!won) {
        const updatedRoom: any = await roomService.catching_miss({ socketId: socket.id, room: currentRoom })
        
        const currentPlayer = updatedRoom.playerList.find((p: PlayerProps) => p.socketId === socket.id)

        setTimeout(() => {
          io.sockets.in(room).emit('catching_punishmentTimeEnd', { room: updatedRoom })
          socket.emit('catching_userPunishmentTimeEnd', { room: updatedRoom, user: currentPlayer })
        }, 3000)

        console.log('catching_miss')
        
        io.sockets.in(room).emit('catching_miss', { room: updatedRoom })
        socket.emit('catching_userMiss', { room: updatedRoom, user: currentPlayer })
      }

      if (won) {
        const updatedRoom: any = await roomService.catching_won({ socketId: socket.id, room: currentRoom })

        const currentPlayer = updatedRoom.playerList.find((p: PlayerProps) => p.socketId === socket.id)

        console.log('catching_hit')

        io.sockets.in(room).emit('catching_hit', { room: updatedRoom, user: currentPlayer })
        socket.emit('catching_userHit', { room: updatedRoom, user: currentPlayer })
      }

      queueResolver && await queueResolver()
    })
  }
}

export default play