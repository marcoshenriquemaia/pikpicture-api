import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import startGame from "../../gameOperations/startGame";
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
    roomQueue.createQueue(`readyStatusChange_${data.room}`);
    roomQueue.enqueue(
      `readyStatusChange_${data.room}`,
      async (queueResolver: Function) => {
        const updatedRoom: any = await roomService.changeReadyStatusPlayer({
          playerId: data.userId,
          status: data.status,
          room: data.room,
        });

        if (updatedRoom.started) return

        console.log('Ready status')

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

        io.sockets.in(updatedDbRoom.hash).emit('startGame', updatedDbRoom)
        
        queueResolver && (await queueResolver());
      }
    );
  };
};

export default readyStatusChange;
