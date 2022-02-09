"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateUniqueNumbers = (quantity, limit) => {
    const numberList = [];
    while (numberList.length < quantity) {
        const randomNumber = Math.floor(Math.random() * limit) + 1;
        if (!numberList.includes(randomNumber))
            numberList.push(randomNumber);
    }
    return numberList;
};
exports.default = generateUniqueNumbers;
