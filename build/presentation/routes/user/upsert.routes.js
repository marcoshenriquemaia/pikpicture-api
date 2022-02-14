"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../../app/services/user"));
const upsertRouter = (deps) => {
    const userService = new user_1.default(deps);
    return async (req, res) => {
        const user = await userService.upsert(req);
        return res.status(200).json(user);
    };
};
exports.default = upsertRouter;
