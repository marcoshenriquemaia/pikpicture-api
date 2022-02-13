"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyPlay = ({ play, currentCard }) => {
    const hasSome = currentCard.some(card => card.category === play);
    return hasSome;
};
exports.default = verifyPlay;
