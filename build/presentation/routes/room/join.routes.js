"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../../app/services/room/index"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const joinRouter = (deps) => {
    const roomService = new index_1.default(deps);
    return async (req, res) => {
        const { room, player } = req.body;
        const updatedRoom = await roomService.joinPlayer({ room, player, returnCurrent: true });
        if (!updatedRoom)
            throw new AppError_1.default('Could not join');
        return res.status(200).json(updatedRoom);
    };
};
exports.default = joinRouter;
