"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateUniqueNumbers_1 = __importDefault(require("../utils/generateUniqueNumbers"));
const { cardList } = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../mock/cardList.json"), {
    encoding: "utf8",
    flag: "r",
}));
const startGame = ({ room }) => {
    const cardIndexList = (0, generateUniqueNumbers_1.default)(room.playerList.length + 1, cardList.length - 1);
    const updatedPlayers = room.playerList.map((player, index) => {
        return {
            ...player,
            card: cardList[cardIndexList[index + 1]]
        };
    });
    return {
        playerList: updatedPlayers,
        started: true,
        currentCard: cardList[cardIndexList[0]].map((card) => ({
            ...card,
            scale: (100 - Math.floor(Math.random() * 50)) / 100
        })),
        hash: room.hash
    };
};
exports.default = startGame;
