import { Socket } from "socket.io";
import { PlayerProps } from "../../../../../@types/env.types";
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
  socket: any
}

const catchingStart = async ({
  updatedRoom,
  roomService,
  io,
  data,
  currentRoom,
  socket
}: CatchingStartProps) => {
  const newRoom = startGame({ room: updatedRoom });

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

  io.sockets.in(updatedDbRoom.hash).emit(GAME.START);
  io.sockets
    .in(updatedDbRoom.hash)
    .emit(GAME.PLAYERS, { playerList: updatedDbRoom.playerList });

  io.sockets
    .in(updatedDbRoom.hash)
    .emit(GAME.UPDATE_MAIN_CARD, { mainCard: updatedDbRoom.currentCard });

  endGame({ io, roomHash: data.room, roomService, timeOut: updatedDbRoom.matchDuration })
};

export default catchingStart;
