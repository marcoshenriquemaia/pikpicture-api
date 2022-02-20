"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../../../../mock/events");
const verifyPlay_1 = __importDefault(require("../../../helpers/verifyPlay"));
const catchingPlay = async ({ socket, io, currentRoom, roomService, queueResolver, tasks, play, }) => {
    const roomHash = currentRoom.hash;
    const player = currentRoom.playerList.find((item) => {
        return item.socketId === socket.id;
    });
    if (player.punishmentTime &&
        new Date(player.punishmentTime).getTime() > new Date().getTime())
        return await queueResolver(false);
    const won = (0, verifyPlay_1.default)({ play, currentCard: player.card, currentRoom });
    if (tasks > 1 && won) {
        socket.emit(events_1.USER.ALMOST);
        return await queueResolver(won);
    }
    if (!won) {
        const updatedRoom = await roomService.miss({
            socketId: socket.id,
            room: currentRoom,
        });
        const currentPlayer = updatedRoom.playerList.find((p) => p.socketId === socket.id);
        setTimeout(async () => {
            const currentRoom = await roomService.getByHash(roomHash);
            io.sockets
                .in(roomHash)
                .emit(events_1.GAME.PLAYERS, { playerList: currentRoom.playerList });
            socket.emit(events_1.USER.PUNISHMENT_END, {
                user: currentPlayer,
            });
        }, 3000);
        io.sockets.in(roomHash).emit(events_1.GAME.MISS, { room: updatedRoom });
        socket.emit(events_1.USER.MISS, {
            room: updatedRoom,
            user: currentPlayer,
        });
    }
    if (won) {
        const updatedRoom = await roomService.won({
            socketId: socket.id,
            room: currentRoom,
        });
        const currentPlayer = updatedRoom.playerList.find((p) => p.socketId === socket.id);
        socket.broadcast.to(roomHash).emit(events_1.GAME.HIT, { user: currentPlayer });
        io.sockets
            .in(roomHash)
            .emit(events_1.GAME.PLAYERS, { playerList: updatedRoom.playerList });
        io.sockets
            .in(roomHash)
            .emit(events_1.GAME.UPDATE_MAIN_CARD, { mainCard: updatedRoom.currentCard });
        socket.emit(events_1.USER.HIT, {});
        socket.emit(events_1.USER.UPDATE, {
            user: currentPlayer,
        });
    }
    queueResolver && (await queueResolver(won));
};
exports.default = catchingPlay;
