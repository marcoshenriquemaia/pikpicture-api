"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const events_1 = require("../../mock/events");
const disconnectRoom = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async () => {
        const room = await roomService.disconnectPlayer(socket.id);
        if (!room)
            return;
        if (!room.playerList.length) {
            await roomService.delete(room._id);
            roomQueue.removeQueue(`catching_play_${room.hash}`);
            roomQueue.removeQueue(`readyStatusChange_${room.hash}`);
            roomQueue.removeQueue(`joinRoom_${room.hash}`);
        }
        await socket.leave(room.hash);
        await socket.broadcast.to(room.hash).emit(events_1.USER.DISCONNECT, room);
        await socket.disconnect();
    };
};
exports.default = disconnectRoom;
