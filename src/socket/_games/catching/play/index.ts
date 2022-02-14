import { PlayerProps } from "../../../../@types/env.types";
import { RoomSchemaTypes } from "../../../../@types/models.types";
import RoomService from "../../../../app/services/room";
import { GAME, USER } from "../../../../mock/events";
import verifyPlay from "../../helpers/verifyPlay";

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
  const roomHash = currentRoom.hash
  const player = currentRoom.playerList.find((item: PlayerProps) => {
    return item.socketId === socket.id;
  });

  if (
    player.punishmentTime &&
    new Date(player.punishmentTime).getTime() > new Date().getTime()
  )
    return await queueResolver(false);

  const won = verifyPlay({ play, currentCard: player.card, currentRoom });

  console.log("tasks", tasks);

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
        .emit(GAME.PUNISHMENT_END, { room: currentRoom });
      socket.emit(USER.PUNISHMENT_END, {
        room: currentRoom,
        user: currentPlayer,
      });
    }, 3000);

    console.log("catching_miss");

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

    io.sockets
      .in(roomHash)
      .emit(GAME.HIT, { room: updatedRoom, user: currentPlayer });
    socket.emit(USER.HIT, {
      room: updatedRoom,
      user: currentPlayer,
    });
  }

  queueResolver && (await queueResolver(won));
};

export default catchingPlay;
