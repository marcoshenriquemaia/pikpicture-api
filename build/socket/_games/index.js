"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const events_1 = require("../../mock/events");
const dicGames_1 = __importDefault(require("./dicGames"));
const games = (socket, deps, io, roomQueue) => {
    const roomService = new room_1.default(deps);
    socket.on(events_1.GAME.PLAY, ({ room, play }) => roomQueue.enqueue(`play_${room}`, async (queueResolver, tasks) => {
        const currentRoom = await roomService.getByHash(room);
        const gameMode = currentRoom.gameMode;
        dicGames_1.default[gameMode]({
            socket,
            io,
            currentRoom,
            roomService,
            queueResolver,
            tasks,
            play,
        });
    }));
};
exports.default = games;
