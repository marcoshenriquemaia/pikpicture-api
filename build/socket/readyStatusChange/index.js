"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const events_1 = require("../../mock/events");
const dicGames_1 = require("../_games/dicGames");
const readyStatusChange = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async (data) => {
        roomQueue.enqueue(`readyStatusChange_${data.room}`, async (queueResolver, queueQuantity) => {
            const currentRoom = await roomService.getByHash(data.room);
            if (currentRoom.started)
                return await queueResolver();
            const updatedRoom = await roomService.changeReadyStatusPlayer({
                playerId: data.userId,
                status: data.status,
                room: data.room,
            });
            io.sockets.in(updatedRoom.hash).emit(events_1.ROOM.STATUS, updatedRoom);
            const [readyQuantity] = updatedRoom.playerList.reduce((acc, player) => {
                player.ready ? acc[0]++ : acc[1]++;
                return acc;
            }, [0, 0]);
            if (readyQuantity < updatedRoom.playerList.length)
                return await queueResolver();
            dicGames_1.dicGameStart[currentRoom.gameMode]({
                updatedRoom,
                roomService,
                io,
                data,
                currentRoom,
                socket
            });
            await queueResolver();
        });
    };
};
exports.default = readyStatusChange;
