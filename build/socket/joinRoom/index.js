"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const joinRoom = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async (data) => {
        roomQueue.createQueue(`joinRoom_${data.room}`);
        roomQueue.enqueue(`joinRoom_${data.room}`, async (queueResolver) => {
            const currentRoom = await roomService.getByHash(data.room);
            if (currentRoom.started) {
                socket.emit('errorJoin', { message: 'Game Started' });
                socket.emit('leaveRoom');
                return await queueResolver();
            }
            const newUser = {
                playerName: data.playerName,
                userId: data.userId,
                card: [],
                ready: false,
                socketId: socket.id,
                points: 0,
                avatar: currentRoom.playerList.length
            };
            const updatedRoom = await roomService.joinPlayer({ room: data.room, player: newUser });
            updatedRoom && await socket.join(data.room);
            updatedRoom && await io.sockets.in(data.room).emit('userJoined', updatedRoom);
            updatedRoom && await socket.emit('userInfo', { user: newUser });
            queueResolver && updatedRoom && await queueResolver();
        });
    };
};
exports.default = joinRoom;
