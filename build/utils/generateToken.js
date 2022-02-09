"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generageToken = (limit) => {
    const itemTokenList = 'ABCDEFGHIJKLMNOPQSTUVWXYZ1234567890';
    let token = '';
    for (let i = 0; i < limit; i++) {
        const randomNumber = Math.floor(Math.random() * itemTokenList.length);
        const letter = itemTokenList[randomNumber];
        token += letter;
    }
    return token;
};
exports.default = generageToken;
