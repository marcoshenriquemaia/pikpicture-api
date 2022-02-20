"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../../mock/events");
const modeList_1 = __importDefault(require("../../../mock/modeList"));
const endGame = ({ roomHash, timeOut, roomService, io }) => {
    setTimeout(async () => {
        var _a;
        const finalRoom = await roomService.getByHash(roomHash);
        const clientList = io.sockets.adapter.rooms.get(roomHash);
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
        const owner = restartedRoom.playerList.find((player) => {
            return restartedRoom.owner.userId === player.userId;
        });
        io.to(owner.socketId).emit(events_1.GAME.MODE, { modes: modeList_1.default });
        io.sockets.in(finalRoom.hash).emit(events_1.GAME.END, { podium: podium });
        io.sockets
            .in(restartedRoom.hash)
            .emit(events_1.GAME.PLAYERS, { playerList: restartedRoom.playerList });
    }, timeOut);
};
exports.default = endGame;
