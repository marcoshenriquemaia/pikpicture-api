import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import startGame from "../../gameOperations/startGame";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";
import play from "../_games/catching/play";

const readyStatusChange = (
  deps: DepsTypes,
  socket: any,
  roomQueue: RoomQueue,
  io: any
) => {
  const roomService = new RoomService(deps);
  return async (data: any) => {
    roomQueue.createQueue(`readyStatusChange_${data.room}`);
    roomQueue.enqueue(
      `readyStatusChange_${data.room}`,
      async (queueResolver: Function) => {
        const currentRoom = await roomService.getByHash(data.room)

        if (currentRoom.started) return
                
        const updatedRoom: any = await roomService.changeReadyStatusPlayer({
          playerId: data.userId,
          status: data.status,
          room: data.room,
        });

        io.sockets.in(updatedRoom.hash).emit('userStatusReadyChange', updatedRoom)

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

        
        //todo
        io.sockets.sockets.forEach((skt: any) => {
          const user = updatedDbRoom.playerList.find((player: any) => {
            return player.socketId === skt.id
          })
  
          user && skt.emit('userInfo', { user })
        })

        io.sockets.in(updatedDbRoom.hash).emit('startGame', { room: updatedDbRoom })
        
        setTimeout(async () => {
          const finalRoom = await roomService.getByHash(data.room)
          const podium = finalRoom.playerList.sort((a: PlayerProps, b: PlayerProps) => {
            return a.points - b.points
          }).reverse().map((player: PlayerProps) => ({
            playerName: player.playerName,
            points: player.points,
            avatar: player.avatar
          }))

          const restartedRoom: any = await roomService.restartGame(finalRoom)

          io.sockets.sockets.forEach((skt: any) => {
            const restartedUser = restartedRoom.playerList.find((player: PlayerProps) => {
              return player.socketId === socket.id
            })
  
            restartedUser && skt.emit('userInfo', { user: restartedUser })
          })

          io.sockets.in(updatedDbRoom.hash).emit('endGame', { room: restartedRoom, podium: podium})

        }, currentRoom.matchDuration)

        queueResolver && (await queueResolver());
      }
    );
  };
};

export default readyStatusChange;
