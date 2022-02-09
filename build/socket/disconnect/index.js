"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const disconnect = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async () => {
        const room = await roomService.disconnectPlayer(socket.id);
        if (!room)
            return;
        console.log('Disconnect');
        await socket.leave(room.hash);
        await socket.broadcast.to(room.hash).emit("userDisconnect", room);
    };
};
exports.default = disconnect;
