import { RoomSchemaTypes } from "../../@types/models.types";
import RoomService from "../../app/services/room";
import { GAME } from "../../mock/events";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";
import { DataPlayTypes } from "./modes/catching/play/types";
import dicGames from "./dicGames";

const games = (socket: any, deps: DepsTypes, io: any, roomQueue: RoomQueue) => {
  const roomService = new RoomService(deps);

  socket.on(GAME.PLAY, ({ room, play }: DataPlayTypes) =>
    roomQueue.enqueue(
      `play_${room}`,
      async (queueResolver: Function, tasks: number) => {
        const currentRoom: RoomSchemaTypes = await roomService.getByHash(room);
        const gameMode = currentRoom.gameMode;

        dicGames[gameMode]({
          socket,
          io,
          currentRoom,
          roomService,
          queueResolver,
          tasks,
          play,
        });
      }
    )
  );
};

export default games;
