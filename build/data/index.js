"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const configureDatabase = async ({ ENV, }) => {
    const url = `${ENV.DB_CONNECTION}`;
    await (0, mongoose_1.connect)(url);
    const RoomSchema = new mongoose_1.Schema({
        hash: { type: String, required: true },
        playerList: { type: Array, default: [] },
        started: { type: Boolean, default: false },
        gameMode: { type: String, default: "catching" },
        owner: { type: Object, require: true },
        currentCard: { type: Array, default: [] },
        finalTime: { type: Date, default: undefined },
        matchDuration: { type: Number, default: 1000 * 60 * 3 },
        gameInfo: { type: Object, default: {} },
        vote: { type: Array, default: [] },
        createdAt: { type: Date, default: Date.now },
    });
    const UserSchema = new mongoose_1.Schema({
        avatar: { type: String, default: () => String(Math.floor(Math.random() * 11)) },
        deviceId: { type: String, required: true },
        email: { type: String },
        name: { type: String },
        victories: [
            new mongoose_1.Schema({
                gameMode: { type: String },
                points: { type: Number },
            }),
        ],
        verified: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    });
    const Room = (0, mongoose_1.model)("Room", RoomSchema);
    const User = (0, mongoose_1.model)("User", UserSchema);
    return { Room, User };
};
exports.default = configureDatabase;
