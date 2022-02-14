"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _abstract_1 = __importDefault(require("../../../data/repositories/_abstract"));
const generateToken_1 = __importDefault(require("../../../utils/generateToken"));
const getCard_1 = __importDefault(require("../../../gameOperations/getCard"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
class RoomService {
    constructor(deps) {
        this.roomRepository = new _abstract_1.default({ model: deps.models.Room });
        this.deps = deps;
    }
    async create(req, roomQueue) {
        const { playerName, userId, gameMode } = req.body;
        const hash = (0, generateToken_1.default)(6);
        const room = await this.roomRepository.create({
            hash,
            gameMode,
            owner: { playerName, userId },
        });
        roomQueue.createQueue(`play_${hash}`, { concurrent: 1, interval: 100 });
        roomQueue.createQueue(`readyStatusChange_${hash}`);
        roomQueue.createQueue(`joinRoom_${hash}`);
        return room;
    }
    async restartGame(room) {
        const newPlayerList = room.playerList.map((player) => {
            return {
                ...player,
                card: [],
                points: 0,
                ready: false,
                roundsWon: [],
            };
        });
        const restartedRoom = await this.roomRepository.update({
            hash: room.hash,
        }, {
            playerList: newPlayerList,
            started: false,
            currentCard: [],
            finalTime: undefined,
        }, {
            returnOriginal: false,
        });
        return restartedRoom;
    }
    async miss({ socketId, room }) {
        const newPlayerList = room.playerList.map((player) => {
            if (player.socketId != socketId)
                return player;
            return {
                ...player,
                punishmentTime: new Date(new Date().getTime() + 3000),
                punishmentTimeInSecond: 3,
            };
        });
        return await this.roomRepository.update({
            _id: room._id,
        }, {
            playerList: newPlayerList
                .sort((a, b) => {
                return a.points - b.points;
            })
                .reverse(),
        }, {
            returnOriginal: false,
        });
    }
    async changeMainCard({ room }) {
        return await this.roomRepository.update({
            hash: room.hash,
        }, {
            currentCard: await (0, getCard_1.default)(room),
        }, {
            returnOriginal: false,
        });
    }
    async setGameRound({ room, round }) {
        return await this.roomRepository.update({
            hash: room.hash,
        }, {
            gameInfo: {
                ...room.gameInfo,
                round
            }
        }, {
            returnOriginal: true,
        });
    }
    async setPlayerWonRound({ room, socketId, round }) {
        const newPlayerList = room.playerList.map((player) => {
            if (player.socketId != socketId)
                return player;
            return {
                ...player,
                roundsWon: [...player.roundsWon, round],
            };
        });
        return await this.roomRepository.update({
            hash: room.hash,
        }, {
            playerList: newPlayerList,
        }, {
            returnOriginal: false,
        });
    }
    async won({ socketId, room, keepCurrentCard, keepPlayerCard, gameInfo, }) {
        const newPlayerList = room.playerList.map((player) => {
            if (player.socketId != socketId)
                return player;
            return {
                ...player,
                points: player.points + 1,
                card: keepPlayerCard ? player.card : room.currentCard,
                gameInfo: gameInfo ? gameInfo : {},
            };
        });
        return await this.roomRepository.update({
            _id: room._id,
        }, {
            currentCard: keepCurrentCard ? room.currentCard : await (0, getCard_1.default)(room),
            playerList: newPlayerList
                .sort((a, b) => {
                return a.points - b.points;
            })
                .reverse(),
        }, {
            returnOriginal: false,
        });
    }
    async disconnectPlayer(socketId) {
        var _a;
        const roomList = await this.roomRepository.list();
        const room = roomList.find((room) => {
            return room.playerList.some((player) => {
                return player.socketId === socketId;
            });
        });
        if (!room)
            return;
        const updatedRoom = await this.roomRepository.update({
            hash: room === null || room === void 0 ? void 0 : room.hash,
        }, {
            playerList: (_a = room.playerList) === null || _a === void 0 ? void 0 : _a.filter((player) => player.socketId !== socketId).sort((a, b) => {
                return a.points - b.points;
            }).reverse(),
        }, {
            returnOriginal: false,
        });
        return updatedRoom;
    }
    async startGame(newRoom) {
        const room = await this.roomRepository.update({ hash: newRoom.hash }, { ...newRoom }, { returnOriginal: false });
        return room;
    }
    async changeReadyStatusPlayer({ status, playerId, room, }) {
        const currentRoom = await this.roomRepository.get({ hash: room });
        const newPlayerList = currentRoom.playerList.map((player) => {
            if (player.userId !== playerId)
                return player;
            return {
                ...player,
                ready: status,
            };
        });
        const updatedRoom = await this.roomRepository.update({ hash: room }, {
            playerList: newPlayerList,
        }, {
            returnOriginal: false,
        });
        return updatedRoom;
    }
    async joinPlayer({ room, player, returnCurrent }) {
        const currentRoom = await this.roomRepository.get({ hash: room });
        if (!currentRoom)
            throw new AppError_1.default("Not found", 404);
        if (currentRoom.started)
            throw new AppError_1.default("The game is already started", 401);
        if (currentRoom.playerList.length >= 100)
            throw new AppError_1.default("Full room", 403);
        if (currentRoom.playerList.some((item) => item.userId === player.userId))
            return false;
        if (returnCurrent)
            return currentRoom;
        return await this.roomRepository.update({
            hash: room,
        }, {
            playerList: [...currentRoom.playerList, { ...player, ready: false }],
        }, {
            returnOriginal: false,
        });
    }
    async delete(_id) {
        return await this.roomRepository.delete(_id);
    }
    async update(criteria, data) {
        return await this.roomRepository.update(criteria, data);
    }
    async getByHash(hash) {
        return await this.roomRepository.get({ hash });
    }
    async get(storeId) {
        return await this.roomRepository.getById(storeId);
    }
    async list() {
        const newStore = await this.roomRepository.list();
        return newStore;
    }
}
exports.default = RoomService;
