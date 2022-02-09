"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { cardList } = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "../mock/cardList.json"), {
    encoding: "utf8",
    flag: "r",
}));
const getCard = (room) => {
    const roomCards = [room.currentCard, ...room.playerList.map((player) => player.card)];
    let found = false;
    let foundedCard;
    while (!found) {
        const randomNumber = Math.floor(Math.random() * cardList.length);
        const card = cardList[randomNumber];
        const foundEqual = roomCards.some((item => {
            const cardListStringfy = JSON.stringify(item.map((c) => c.category));
            return JSON.stringify(card.map((c) => c.category)) === cardListStringfy;
        }));
        if (!foundEqual) {
            foundedCard = card;
            found = true;
        }
    }
    return foundedCard;
};
exports.default = getCard;
