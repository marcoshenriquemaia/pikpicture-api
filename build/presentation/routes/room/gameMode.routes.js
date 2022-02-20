"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../../app/services/room/index"));
const gameModeRouter = (deps) => {
    const roomService = new index_1.default(deps);
    return async (req, res) => {
        const room = await roomService.changeGameMode(req);
        return res.status(200).json(room);
    };
};
exports.default = gameModeRouter;
