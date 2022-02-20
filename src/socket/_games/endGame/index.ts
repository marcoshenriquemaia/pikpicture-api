import { PlayerProps } from "../../../@types/env.types";
import RoomService from "../../../app/services/room";
import { GAME, USER } from "../../../mock/events";
import modeList from "../../../mock/modeList";

interface EndGameProps {
  roomHash: string
  timeOut: number
  roomService: RoomService
  io: any
}

const endGame = ({ roomHash, timeOut, roomService, io }: EndGameProps) => {
  setTimeout(async () => {
    const finalRoom = await roomService.getByHash(roomHash);

    const clientList = io.sockets.adapter.rooms.get(roomHash);

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

    const owner = restartedRoom.playerList.find((player: PlayerProps) => {
      return restartedRoom.owner.userId === player.userId
    })

    io.to(owner.socketId).emit(GAME.MODE, { modes: modeList })

    io.sockets.in(finalRoom.hash).emit(GAME.END, { podium: podium });

    io.sockets
      .in(restartedRoom.hash)
      .emit(GAME.PLAYERS, { playerList: restartedRoom.playerList });
  }, timeOut);
}

export default endGame