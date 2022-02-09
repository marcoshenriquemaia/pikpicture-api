"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("../../app/services/room"));
const startGame_1 = __importDefault(require("../../gameOperations/startGame"));
const readyStatusChange = (deps, socket, roomQueue, io) => {
    const roomService = new room_1.default(deps);
    return async (data) => {
        roomQueue.createQueue(`readyStatusChange_${data.room}`);
        roomQueue.enqueue(`readyStatusChange_${data.room}`, async (queueResolver) => {
            const currentRoom = await roomService.getByHash(data.room);
            if (currentRoom.started)
                return;
            const updatedRoom = await roomService.changeReadyStatusPlayer({
                playerId: data.userId,
                status: data.status,
                room: data.room,
            });
            io.sockets.in(updatedRoom.hash).emit('userStatusReadyChange', updatedRoom);
            const [readyQuantity] = updatedRoom.playerList.reduce((acc, player) => {
                player.ready ? acc[0]++ : acc[1]++;
                return acc;
            }, [0, 0]);
            if (readyQuantity < updatedRoom.playerList.length)
                return await queueResolver();
            const newRoom = (0, startGame_1.default)({ room: updatedRoom });
            const updatedDbRoom = await roomService.startGame(newRoom);
            //todo
            io.sockets.sockets.forEach((skt) => {
                const user = updatedDbRoom.playerList.find((player) => {
                    return player.socketId === skt.id;
                });
                user && skt.emit('userInfo', { user });
            });
            io.sockets.in(updatedDbRoom.hash).emit('startGame', { room: updatedDbRoom });
            setTimeout(async () => {
                const finalRoom = await roomService.getByHash(data.room);
                const podium = finalRoom.playerList.sort((a, b) => {
                    return a.points - b.points;
                }).reverse().map((player) => ({
                    playerName: player.playerName,
                    points: player.points,
                    avatar: player.avatar
                }));
                const restartedRoom = await roomService.restartGame(finalRoom);
                io.sockets.sockets.forEach((skt) => {
                    const restartedUser = restartedRoom.playerList.find((player) => {
                        return player.socketId === socket.id;
                    });
                    restartedUser && skt.emit('userInfo', { user: restartedUser });
                });
                io.sockets.in(updatedDbRoom.hash).emit('endGame', { room: restartedRoom, podium: podium });
            }, currentRoom.matchDuration);
            queueResolver && (await queueResolver());
        });
    };
};
exports.default = readyStatusChange;
