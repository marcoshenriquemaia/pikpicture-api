"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../../mock/events");
const modeRoom = (deps, socket, roomQueue, io) => {
    return async (data) => {
        await io.sockets.in(data.room).emit(events_1.ROOM.CHANGE_MODE, { mode: data.mode });
    };
};
exports.default = modeRoom;
