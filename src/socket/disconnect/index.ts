import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import { GAME, USER } from "../../mock/events";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";

const disconnect = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps);

  return async () => {
    const roomList = await roomService.list();

    const room = await roomService.disconnectPlayer(socket.id);

    if (!room) return;

    const currentRoom = roomList.find((room) => {
      return room.playerList.some((player: PlayerProps) => {
        return player.socketId === socket.id;
      });
    });

    if (!currentRoom) return

    const user = currentRoom.playerList.find((player: PlayerProps) => {
      return player.socketId === socket.id
    })
    
    if (!room.playerList.length){
      await roomService.delete(room._id)
      roomQueue.removeQueue(`catching_play_${room.hash}`)
      roomQueue.removeQueue(`readyStatusChange_${room.hash}`)
      roomQueue.removeQueue(`joinRoom_${room.hash}`)
    }

    await io.sockets.in(room.hash).emit(GAME.PLAYERS, { playerList: room.playerList });
    await socket.leave(room.hash);
  };
};

export default disconnect;
