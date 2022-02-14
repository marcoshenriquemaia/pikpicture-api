import { PlayerProps } from "../../../../@types/env.types";
import RoomService from "../../../../app/services/room";
import startGame from "../../../../gameOperations/startGame";
import { GAME, USER } from "../../../../mock/events";

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
    8000, 8000, 8000, 6000, 6000, 5000, 4000, 3000, 3000, 3000, 3000, 3000,
    3000, 3000, 3000, 3000, 2000, 2000, 2000, 1000, 1000, 1000, 1000, 1000,
    1000, 1000,
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


  setTimeout(async () => {
    const finalRoom = await roomService.getByHash(data.room);

    if (!finalRoom) return;

    const podium = finalRoom?.playerList
      ?.sort((a: PlayerProps, b: PlayerProps) => {
        return a.points - b.points;
      })
      .reverse()
      .map((player: PlayerProps) => ({
        playerName: player.playerName,
        points: player.points,
        avatar: player.avatar,
      }));

    const restartedRoom: any = await roomService.restartGame(finalRoom);

    clientList.forEach((socketId: any) => {
      const restartedUser = restartedRoom.playerList.find(
        (player: PlayerProps) => {
          return player.socketId === socketId;
        }
      );

      const clientListSocket = io.sockets.sockets.get(socketId);

      restartedUser &&
        clientListSocket.emit(USER.UPDATE, { user: restartedUser });
    });

    io.sockets
      .in(updatedDbRoom.hash)
      .emit(GAME.END, { room: restartedRoom, podium: podium });
  }, gameTime + roundTimes.length * 30);

  for (let i = 0; i < roundTimes.length; i++) {
    const time = roundTimes[i]
    const runTime = async () => {
      const currentRoom = await roomService.getByHash(data.room)

      if (!currentRoom) return 
      
      const room = await roomService.changeMainCard({ room: currentRoom })

      roomService.setGameRound({ room: currentRoom, round: i })

      io.sockets.in(data.room).emit(GAME.UPDATE_MAIN_CARD, { room })
      io.sockets.in(data.room).emit(GAME.TIME, { time })

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
