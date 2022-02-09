"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const queue_1 = __importDefault(require("../queue"));
const disconnect_1 = __importDefault(require("./disconnect"));
const disconnectRoom_1 = __importDefault(require("./disconnectRoom"));
const joinRoom_1 = __importDefault(require("./joinRoom"));
const readyStatusChange_1 = __importDefault(require("./readyStatusChange"));
const _games_1 = __importDefault(require("./_games"));
const configureSocket = (app, deps) => {
    const roomQueue = new queue_1.default();
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*'
        }
    });
    io.sockets.on('connection', socket => {
        socket.on('joinRoom', (0, joinRoom_1.default)(deps, socket, roomQueue, io));
        socket.on('readyStatusChange', (0, readyStatusChange_1.default)(deps, socket, roomQueue, io));
        socket.on('disconnect', (0, disconnect_1.default)(deps, socket, roomQueue, io));
        socket.on('leaveRoom', (0, disconnectRoom_1.default)(deps, socket, roomQueue, io));
        (0, _games_1.default)(socket, deps, io);
    });
    return server;
};
exports.default = configureSocket;
