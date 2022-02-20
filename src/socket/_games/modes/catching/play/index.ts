import { PlayerProps } from "../../../../../@types/env.types";
import { RoomSchemaTypes } from "../../../../../@types/models.types";
import RoomService from "../../../../../app/services/room";
import { GAME, USER } from "../../../../../mock/events";
import verifyPlay from "../../../helpers/verifyPlay";

export interface PlayModeProps {
  socket: any;
  roomService: RoomService;
  io: any;
  currentRoom: RoomSchemaTypes;
  queueResolver: Function;
  tasks: number;
  play: number;
}

const catchingPlay = async ({
  socket,
  io,
  currentRoom,
  roomService,
  queueResolver,
  tasks,
  play,
}: PlayModeProps) => {
  const roomHash = currentRoom.hash;
  const player = currentRoom.playerList.find((item: PlayerProps) => {
    return item.socketId === socket.id;
  });

  if (
    player.punishmentTime &&
    new Date(player.punishmentTime).getTime() > new Date().getTime()
  )
    return await queueResolver(false);

  const won = verifyPlay({ play, currentCard: player.card, currentRoom });

  if (tasks > 1 && won) {
    socket.emit(USER.ALMOST);

    return await queueResolver(won);
  }

  if (!won) {
    const updatedRoom: any = await roomService.miss({
      socketId: socket.id,
      room: currentRoom,
    });

    const currentPlayer = updatedRoom.playerList.find(
      (p: PlayerProps) => p.socketId === socket.id
    );

    setTimeout(async () => {
      const currentRoom = await roomService.getByHash(roomHash);

      io.sockets
        .in(roomHash)
        .emit(GAME.PLAYERS, { playerList: currentRoom.playerList });

      socket.emit(USER.PUNISHMENT_END, {
        user: currentPlayer,
      });
    }, 3000);

    io.sockets.in(roomHash).emit(GAME.MISS, { room: updatedRoom });
    socket.emit(USER.MISS, {
      room: updatedRoom,
      user: currentPlayer,
    });
  }

  if (won) {
    const updatedRoom: any = await roomService.won({
      socketId: socket.id,
      room: currentRoom,
    });

    const currentPlayer = updatedRoom.playerList.find(
      (p: PlayerProps) => p.socketId === socket.id
    );

    socket.broadcast.to(roomHash).emit(GAME.HIT, { user: currentPlayer });

    io.sockets
      .in(roomHash)
      .emit(GAME.PLAYERS, { playerList: updatedRoom.playerList });

    io.sockets
      .in(roomHash)
      .emit(GAME.UPDATE_MAIN_CARD, { mainCard: updatedRoom.currentCard });

    socket.emit(USER.HIT, {});

    socket.emit(USER.UPDATE, {
      user: currentPlayer,
    });
  }

  queueResolver && (await queueResolver(won));
};

export default catchingPlay;
