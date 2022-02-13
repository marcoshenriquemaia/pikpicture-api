import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import startGame from "../../gameOperations/startGame";
import { GAME, ROOM, USER } from "../../mock/events";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";

const readyStatusChange = (
  deps: DepsTypes,
  socket: any,
  roomQueue: RoomQueue,
  io: any
) => {
  const roomService = new RoomService(deps);
  return async (data: any) => {
    roomQueue.enqueue(
      `readyStatusChange_${data.room}`,
      async (queueResolver: Function, queueQuantity: number) => {
        const currentRoom = await roomService.getByHash(data.room)

        if (currentRoom.started) return await queueResolver()
                
        const updatedRoom: any = await roomService.changeReadyStatusPlayer({
          playerId: data.userId,
          status: data.status,
          room: data.room,
        });

        io.sockets.in(updatedRoom.hash).emit(ROOM.STATUS, updatedRoom)

        const [readyQuantity] = updatedRoom.playerList.reduce(
          (acc: number[], player: PlayerProps) => {
            player.ready ? acc[0]++ : acc[1]++;
            return acc;
          },
          [0, 0]
        );

        if (readyQuantity < updatedRoom.playerList.length) return await queueResolver()
        
        const newRoom = startGame({ room: updatedRoom })

        const updatedDbRoom: any = await roomService.startGame(newRoom)

        const clientList = io.sockets.adapter.rooms.get(data.room)
        
        //todo
        clientList.forEach((socketId: any) => {
          const user = updatedDbRoom.playerList.find((player: any) => {
            return player.socketId === socketId
          })

          const clientListSocket = io.sockets.sockets.get(socketId)
  
          user && clientListSocket.emit(USER.UPDATE, { user })
        })

        io.sockets.in(updatedDbRoom.hash).emit(GAME.START, { room: updatedDbRoom })
        
        setTimeout(async () => {
          const finalRoom = await roomService.getByHash(data.room)

          if (!finalRoom) return 

          const podium = finalRoom?.playerList?.sort((a: PlayerProps, b: PlayerProps) => {
            return a.points - b.points
          }).reverse().map((player: PlayerProps) => ({
            playerName: player.playerName,
            points: player.points,
            avatar: player.avatar
          }))

          const restartedRoom: any = await roomService.restartGame(finalRoom)

          clientList.forEach((socketId: any) => {
            const restartedUser = restartedRoom.playerList.find((player: PlayerProps) => {
              return player.socketId === socketId
            })

            const clientListSocket = io.sockets.sockets.get(socketId)
  
            restartedUser && clientListSocket.emit(USER.UPDATE, { user: restartedUser })
          })

          io.sockets.in(updatedDbRoom.hash).emit(GAME.END, { room: restartedRoom, podium: podium})

        }, currentRoom.matchDuration)

        queueResolver && (await queueResolver());
      }
    );
  };
};

export default readyStatusChange;
