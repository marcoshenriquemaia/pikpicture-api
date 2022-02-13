"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const events_1 = require("../mock/events");
const disconnect_1 = __importDefault(require("./disconnect"));
const disconnectRoom_1 = __importDefault(require("./disconnectRoom"));
const joinRoom_1 = __importDefault(require("./joinRoom"));
const readyStatusChange_1 = __importDefault(require("./readyStatusChange"));
const _games_1 = __importDefault(require("./_games"));
const configureSocket = (app, deps) => {
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.sockets.on('connection', socket => {
        socket.on(events_1.ROOM.JOIN, (0, joinRoom_1.default)(deps, socket, deps.roomQueue, io));
        socket.on(events_1.ROOM.STATUS, (0, readyStatusChange_1.default)(deps, socket, deps.roomQueue, io));
        socket.on(events_1.ROOM.LEAVE, (0, disconnectRoom_1.default)(deps, socket, deps.roomQueue, io));
        socket.on('disconnect', (0, disconnect_1.default)(deps, socket, deps.roomQueue, io));
        (0, _games_1.default)(socket, deps, io, deps.roomQueue);
    });
    return server;
};
exports.default = configureSocket;
