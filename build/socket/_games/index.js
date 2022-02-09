"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = __importDefault(require("../../queue"));
const catching_1 = __importDefault(require("./catching"));
const games = (socket, deps, io) => {
    const roomQueue = new queue_1.default();
    (0, catching_1.default)(socket, deps, roomQueue, io);
};
exports.default = games;
