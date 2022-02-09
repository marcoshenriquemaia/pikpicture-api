"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const play_1 = __importDefault(require("./play"));
const catchingMode = (socket, deps, roomQueue, io) => {
    socket.on('catching_play', (0, play_1.default)(socket, deps, roomQueue, io));
};
exports.default = catchingMode;
