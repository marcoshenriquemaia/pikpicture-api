"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dicGameStart = void 0;
const play_1 = __importDefault(require("./catching/play"));
const start_1 = __importDefault(require("./catching/start"));
const play_2 = __importDefault(require("./bullet/play"));
const start_2 = __importDefault(require("./bullet/start"));
const dicGames = {
    catching: play_1.default,
    bullet: play_2.default
};
exports.dicGameStart = {
    catching: start_1.default,
    bullet: start_2.default
};
exports.default = dicGames;
