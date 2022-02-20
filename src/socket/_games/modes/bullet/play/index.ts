import { PlayerProps } from "../../../../../@types/env.types";
import { GAME, USER } from "../../../../../mock/events";
import { PlayModeProps } from "../../catching/play";
import verifyPlay from "../../../helpers/verifyPlay";

const bulletPlay = async ({
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

  if (player.roundsWon.includes(currentRoom.gameInfo.round))
    return await queueResolver();

  if (
    player.punishmentTime &&
    new Date(player.punishmentTime).getTime() > new Date().getTime()
  )
    return await queueResolver(false);

  const won = verifyPlay({ play, currentCard: player.card, currentRoom });

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

    io.sockets
      .in(roomHash)
      .emit(GAME.PLAYERS, { playerList: updatedRoom.playerList });
    socket.emit(USER.MISS, {
      user: currentPlayer,
    });
  }

  if (won) {
    const updatedRoom: any = await roomService.won({
      socketId: socket.id,
      room: currentRoom,
      keepCurrentCard: true,
      keepPlayerCard: true,
    });

    await roomService.setPlayerWonRound({
      room: updatedRoom,
      round: updatedRoom.gameInfo.round,
      socketId: socket.id,
    });

    const currentPlayer = updatedRoom.playerList.find(
      (p: PlayerProps) => p.socketId === socket.id
    );

    io.sockets
      .in(roomHash)
      .emit(GAME.PLAYERS, { playerList: updatedRoom.playerList });

    socket.emit(USER.HIT, {
      user: currentPlayer,
      keepWonMessage: true,
    });

    socket.emit(USER.UPDATE, {
      user: currentPlayer,
    });
  }

  await queueResolver();
};

export default bulletPlay;
