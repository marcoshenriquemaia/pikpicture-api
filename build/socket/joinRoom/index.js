"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const events_1 = require("../../mock/events");
const joinRoom = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async (data) => {
        roomQueue.enqueue(`joinRoom_${data.room}`, async (queueResolver) => {
            const currentRoom = await roomService.getByHash(data.room);
            if (currentRoom.started)
                return await queueResolver();
            const newUser = {
                playerName: data.playerName,
                userId: data.userId,
                card: [],
                ready: false,
                socketId: socket.id,
                points: 0,
                avatar: currentRoom.playerList.length,
                roundsWon: []
            };
            const updatedRoom = await roomService.joinPlayer({ room: data.room, player: newUser });
            updatedRoom && await socket.join(data.room);
            updatedRoom && await io.sockets.in(data.room).emit(events_1.ROOM.JOIN, updatedRoom);
            updatedRoom && await socket.emit(events_1.USER.UPDATE, { user: newUser });
            queueResolver && updatedRoom && await queueResolver();
        });
    };
};
exports.default = joinRoom;
