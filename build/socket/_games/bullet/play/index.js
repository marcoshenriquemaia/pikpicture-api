"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../../../mock/events");
const verifyPlay_1 = __importDefault(require("../../helpers/verifyPlay"));
const bulletPlay = async ({ socket, io, currentRoom, roomService, queueResolver, tasks, play, }) => {
    const roomHash = currentRoom.hash;
    const player = currentRoom.playerList.find((item) => {
        return item.socketId === socket.id;
    });
    if (player.roundsWon.includes(currentRoom.gameInfo.round))
        return await queueResolver();
    console.log('Primeira vitoria');
    if (player.punishmentTime &&
        new Date(player.punishmentTime).getTime() > new Date().getTime())
        return await queueResolver(false);
    const won = (0, verifyPlay_1.default)({ play, currentCard: player.card, currentRoom });
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
                .emit(events_1.GAME.PUNISHMENT_END, { room: currentRoom });
            socket.emit(events_1.USER.PUNISHMENT_END, {
                room: currentRoom,
                user: currentPlayer,
            });
        }, 3000);
        console.log("catching_miss");
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
            keepCurrentCard: true,
            keepPlayerCard: true
        });
        await roomService.setPlayerWonRound({
            room: updatedRoom,
            round: updatedRoom.gameInfo.round,
            socketId: socket.id
        });
        const currentPlayer = updatedRoom.playerList.find((p) => p.socketId === socket.id);
        console.log('currentPlayer', currentPlayer);
        // io.sockets
        //   .in(roomHash)
        //   .emit(GAME.HIT, { room: updatedRoom, user: currentPlayer });
        socket.emit(events_1.USER.HIT, {
            room: updatedRoom,
            user: currentPlayer,
            keepMainCard: true,
            showWonMessage: true
        });
    }
    await queueResolver();
};
exports.default = bulletPlay;
