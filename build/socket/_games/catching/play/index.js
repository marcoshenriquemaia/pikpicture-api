"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../../../app/services/room"));
const verifyPlay_1 = __importDefault(require("../../helpers/verifyPlay"));
const play = (socket, deps, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return ({ room, play }) => {
        roomQueue.createQueue(`catching_play_${room}`);
        roomQueue.enqueue(`catching_play_${room}`, async (queueResolver, taskQuantity) => {
            const currentRoom = await roomService.getByHash(room);
            const player = currentRoom.playerList.find((item) => {
                return item.socketId === socket.id;
            });
            if (player.punishmentTime && (new Date(player.punishmentTime).getTime() > new Date().getTime()))
                return await queueResolver();
            const won = (0, verifyPlay_1.default)({ play, currentCard: player.card });
            if (!won) {
                const updatedRoom = await roomService.catching_miss({ socketId: socket.id, room: currentRoom });
                const currentPlayer = updatedRoom.playerList.find((p) => p.socketId === socket.id);
                setTimeout(() => {
                    io.sockets.in(room).emit('catching_punishmentTimeEnd', { room: updatedRoom });
                    socket.emit('catching_userPunishmentTimeEnd', { room: updatedRoom, user: currentPlayer });
                }, 3000);
                console.log('catching_miss');
                io.sockets.in(room).emit('catching_miss', { room: updatedRoom });
                socket.emit('catching_userMiss', { room: updatedRoom, user: currentPlayer });
            }
            if (won) {
                const updatedRoom = await roomService.catching_won({ socketId: socket.id, room: currentRoom });
                const currentPlayer = updatedRoom.playerList.find((p) => p.socketId === socket.id);
                console.log('catching_hit');
                io.sockets.in(room).emit('catching_hit', { room: updatedRoom, user: currentPlayer });
                socket.emit('catching_userHit', { room: updatedRoom, user: currentPlayer });
            }
            queueResolver && await queueResolver();
        });
    };
};
exports.default = play;
