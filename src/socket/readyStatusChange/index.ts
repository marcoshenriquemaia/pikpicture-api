import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import startGame from "../../gameOperations/startGame";
import { GAME, ROOM, USER } from "../../mock/events";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";
import { dicGameStart } from "../_games/dicGames";

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
        
        dicGameStart[currentRoom.gameMode]({
          updatedRoom,
          roomService,
          io,
          data,
          currentRoom
        })
      }
    );
  };
};

export default readyStatusChange;
