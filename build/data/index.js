"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const configureDatabase = async ({ ENV }) => {
    const url = `${ENV.DB_CONNECTION}`;
    await (0, mongoose_1.connect)(url);
    const RoomSchema = new mongoose_1.Schema({
        hash: { type: String, required: true },
        playerList: { type: Array, default: [] },
        started: { type: Boolean, default: false },
        gameMode: { type: String, default: 'catching' },
        owner: { type: Object, require: true },
        currentCard: { type: Array, default: [] },
        finalTime: { type: Date, default: undefined },
        matchDuration: { type: Number, default: 1000 * 60 * 3 },
        createdAt: { type: Date, default: Date.now }
    });
    const Room = (0, mongoose_1.model)('Room', RoomSchema);
    return { Room };
};
exports.default = configureDatabase;
