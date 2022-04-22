import { PlayerProps } from "../../../../../@types/env.types";
import { RoomSchemaTypes } from "../../../../../@types/models.types";
import RoomService from "../../../../../app/services/room";
import startGame from "../../../../../gameOperations/startGame";
import { GAME, USER } from "../../../../../mock/events";
import endGame from "../../../endGame";

export interface CatchingStartProps {
  updatedRoom: any;
  roomService: RoomService;
  io: any;
  data: any;
  currentRoom: any;
}

const bulletStart = async ({
  updatedRoom,
  roomService,
  io,
  data,
  currentRoom,
}: CatchingStartProps) => {
  const newRoom = startGame({ room: updatedRoom });

  const roundTimes = [
    8000, 8000, 8000, 6000, 6000, 5000, 5000, 5000, 5000, 5000, 4000, 4000,
    4000, 4000, 4000, 4000, 4000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
    2000, 2000,
  ];

  const gameTime = roundTimes.reduce((acc: number, time: number) => {
    return acc + time;
  }, 0);

  const updatedDbRoom: any = await roomService.startGame(newRoom);

  const clientList = io.sockets.adapter.rooms.get(data.room);

  //todo
  clientList.forEach((socketId: any) => {
    const user = updatedDbRoom.playerList.find((player: any) => {
      return player.socketId === socketId;
    });

    const clientListSocket = io.sockets.sockets.get(socketId);

    user && clientListSocket.emit(USER.UPDATE, { user });
  });

  io.sockets.in(updatedDbRoom.hash).emit(GAME.START, { room: updatedDbRoom });

  endGame({ io, roomHash: data.room, roomService, timeOut: gameTime + roundTimes.length * 30 })

  for (let i = 0; i < roundTimes.length; i++) {
    const time = roundTimes[i];
    const runTime = async () => {
      const currentRoom = await roomService.getByHash(data.room);

      if (!currentRoom) return;

      const room = await roomService.changeMainCard({ room: currentRoom });

      roomService.setGameRound({ room: currentRoom, round: i });

      io.sockets
        .in(data.room)
        .emit(GAME.UPDATE_MAIN_CARD, { mainCard: room.currentCard });
        
      io.sockets.in(data.room).emit(GAME.TIME, { time });

      return new Promise((resolver) => {
        setTimeout(() => {
          resolver(true);
        }, time);
      });
    };

    await runTime();
  }
};

export default bulletStart;
