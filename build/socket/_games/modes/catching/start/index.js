"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const startGame_1 = __importDefault(require("../../../../../gameOperations/startGame"));
const events_1 = require("../../../../../mock/events");
const endGame_1 = __importDefault(require("../../../endGame"));
const catchingStart = async ({ updatedRoom, roomService, io, data, currentRoom, socket }) => {
    const newRoom = (0, startGame_1.default)({ room: updatedRoom });
    const updatedDbRoom = await roomService.startGame(newRoom);
    const clientList = io.sockets.adapter.rooms.get(data.room);
    //todo
    clientList.forEach((socketId) => {
        const user = updatedDbRoom.playerList.find((player) => {
            return player.socketId === socketId;
        });
        const clientListSocket = io.sockets.sockets.get(socketId);
        user && clientListSocket.emit(events_1.USER.UPDATE, { user });
    });
    io.sockets.in(data.room).emit(events_1.GAME.TIME, { time: updatedDbRoom.matchDuration });
    io.sockets.in(updatedDbRoom.hash).emit(events_1.GAME.START);
    io.sockets
        .in(updatedDbRoom.hash)
        .emit(events_1.GAME.PLAYERS, { playerList: updatedDbRoom.playerList });
    io.sockets
        .in(updatedDbRoom.hash)
        .emit(events_1.GAME.UPDATE_MAIN_CARD, { mainCard: updatedDbRoom.currentCard });
    (0, endGame_1.default)({ io, roomHash: data.room, roomService, timeOut: updatedDbRoom.matchDuration });
};
exports.default = catchingStart;
