import { PlayerProps } from "../../@types/env.types";
import RoomService from "../../app/services/room";
import { GAME, USER } from "../../mock/events";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";

const disconnectRoom = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps);

  return async ({ room: roomHash }: { room: string }) => {
    const currentRoom = await roomService.getByHash(roomHash)

    if (!currentRoom) return

    const user = currentRoom.playerList.find((player: PlayerProps) => {
      return player.socketId === socket.id
    })

    const room = await roomService.disconnectPlayer(socket.id);

    if (!room) return;

    if (!room.playerList.length){
      await roomService.delete(room._id)
      roomQueue.removeQueue(`catching_play_${room.hash}`)
      roomQueue.removeQueue(`readyStatusChange_${room.hash}`)
      roomQueue.removeQueue(`joinRoom_${room.hash}`)
    }

    await socket.leave(room.hash);
    await socket.broadcast.to(room.hash).emit(GAME.PLAYERS, { playerList: currentRoom.playerList });
    await socket.disconnect()
  };
};

export default disconnectRoom;
