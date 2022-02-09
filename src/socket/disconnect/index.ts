import RoomService from "../../app/services/room";
import { DepsTypes } from "../../presentation/types";
import RoomQueue from "../../queue";

const disconnect = (deps: DepsTypes, socket: any, roomQueue: RoomQueue, io: any) => {
  const roomService = new RoomService(deps);

  return async () => {
    const room = await roomService.disconnectPlayer(socket.id);

    if (!room) return;
    
    console.log('Disconnect')
    
    await socket.leave(room.hash);
    await socket.broadcast.to(room.hash).emit("userDisconnect", room);
  };
};

export default disconnect;
