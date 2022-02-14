"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const startGame_1 = __importDefault(require("../../../../gameOperations/startGame"));
const events_1 = require("../../../../mock/events");
const bulletStart = async ({ updatedRoom, roomService, io, data, currentRoom, }) => {
    const newRoom = (0, startGame_1.default)({ room: updatedRoom });
    const roundTimes = [
        8000, 8000, 8000, 6000, 6000, 5000, 4000, 3000, 3000, 3000, 3000, 3000,
        3000, 3000, 3000, 3000, 2000, 2000, 2000, 1000, 1000, 1000, 1000, 1000,
        1000, 1000,
    ];
    const gameTime = roundTimes.reduce((acc, time) => {
        return acc + time;
    }, 0);
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
    io.sockets.in(updatedDbRoom.hash).emit(events_1.GAME.START, { room: updatedDbRoom });
    setTimeout(async () => {
        var _a;
        const finalRoom = await roomService.getByHash(data.room);
        if (!finalRoom)
            return;
        const podium = (_a = finalRoom === null || finalRoom === void 0 ? void 0 : finalRoom.playerList) === null || _a === void 0 ? void 0 : _a.sort((a, b) => {
            return a.points - b.points;
        }).reverse().map((player) => ({
            playerName: player.playerName,
            points: player.points,
            avatar: player.avatar,
        }));
        const restartedRoom = await roomService.restartGame(finalRoom);
        clientList.forEach((socketId) => {
            const restartedUser = restartedRoom.playerList.find((player) => {
                return player.socketId === socketId;
            });
            const clientListSocket = io.sockets.sockets.get(socketId);
            restartedUser &&
                clientListSocket.emit(events_1.USER.UPDATE, { user: restartedUser });
        });
        io.sockets
            .in(updatedDbRoom.hash)
            .emit(events_1.GAME.END, { room: restartedRoom, podium: podium });
    }, gameTime + roundTimes.length * 30);
    for (let i = 0; i < roundTimes.length; i++) {
        const time = roundTimes[i];
        const runTime = async () => {
            const currentRoom = await roomService.getByHash(data.room);
            if (!currentRoom)
                return;
            const room = await roomService.changeMainCard({ room: currentRoom });
            roomService.setGameRound({ room: currentRoom, round: i });
            io.sockets.in(data.room).emit(events_1.GAME.UPDATE_MAIN_CARD, { room });
            io.sockets.in(data.room).emit(events_1.GAME.TIME, { time });
            return new Promise((resolver) => {
                setTimeout(() => {
                    resolver(true);
                }, time);
            });
        };
        await runTime();
    }
};
exports.default = bulletStart;
