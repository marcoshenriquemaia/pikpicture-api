import RoomService from "../../app/services/room"
import { DepsTypes } from "../../presentation/types"
import RoomQueue from "../../queue"

const joinRoom = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps)
  return async (data: any) => {
    roomQueue.createQueue(`joinRoom_${data.room}`)
    roomQueue.enqueue(`joinRoom_${data.room}`, async (queueResolver: Function) => {
      const currentRoom: any = await roomService.getByHash(data.room)

      if (currentRoom.started) {
        socket.emit('errorJoin', { message: 'Game Started' })
        return await queueResolver()
      }

      const updatedRoom: any = await roomService.joinPlayer({ room: data.room, player: {
        playerName: data.playerName,
        userId: data.userId,
        card: [],
        ready: false,
        socketId: socket.id,
        points: 0
      }})

      console.log('Join');
      
      updatedRoom && await socket.join(data.room)
      updatedRoom && await io.sockets.in(data.room).emit('userJoined', updatedRoom )
      queueResolver && updatedRoom && await queueResolver()
    })
  }
}

export default joinRoom