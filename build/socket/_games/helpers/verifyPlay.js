"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyPlay = ({ play, currentCard }) => {
    return currentCard.some(card => card.category === play);
};
exports.default = verifyPlay;
