import RoomService from "../../app/services/room"
import { GAME, ROOM, USER } from "../../mock/events"
import { DepsTypes } from "../../presentation/types"
import RoomQueue from "../../queue"

const joinRoom = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps)
  return async (data: any) => {
    roomQueue.enqueue(`joinRoom_${data.room}`, async (queueResolver: Function) => {
    const currentRoom: any = await roomService.getByHash(data.room)

      if (currentRoom.started) return await queueResolver()
      
      const newUser = {
        playerName: data.playerName,
        userId: data.userId,
        card: [],
        ready: false,
        socketId: socket.id,
        points: 0,
        avatar: currentRoom.playerList.length,
        roundsWon: []
      }
      
      const updatedRoom: any = await roomService.joinPlayer({ room: data.room, player: newUser })

      updatedRoom && await socket.join(data.room)
      updatedRoom && await socket.broadcast.to(data.room).emit(ROOM.JOIN, { user: newUser} )
      updatedRoom && await io.sockets.in(data.room).emit(GAME.PLAYERS, { playerList: updatedRoom.playerList} )
      updatedRoom && await socket.emit(USER.UPDATE, { user: newUser } )
      queueResolver && updatedRoom && await queueResolver()
    })
  }
}

export default joinRoom