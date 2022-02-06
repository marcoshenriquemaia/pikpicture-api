import RoomService from "../../app/services/room"
import { DepsTypes } from "../../presentation/types"
import RoomQueue from "../../queue"

const joinRoom = (deps: DepsTypes, socket: any, roomQueue: RoomQueue) => {
  const roomService = new RoomService(deps)
  return async (data: any) => {
    roomQueue.createQueue(`joinRoom_${data.room}`)
    roomQueue.enqueue(`joinRoom_${data.room}`, async (queueResolver: Function) => {
      const currentRoom = await roomService.joinPlayer({ room: data.room, player: {
        playerName: data.playerName,
        userId: data.userId
      }})

      console.log('blee')

      currentRoom && socket.join(data.room)
      currentRoom && socket.broadcast.to(data.room).emit('userJoined', currentRoom)
      queueResolver && currentRoom && await queueResolver()
    })
  }
}

export default joinRoom