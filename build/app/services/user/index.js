"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _abstract_1 = __importDefault(require("../../../data/repositories/_abstract"));
class UserService {
    constructor(deps) {
        this.userRepository = new _abstract_1.default({ model: deps.models.User });
        this.deps = deps;
    }
    async upsert(req) {
        const { deviceId } = req.body;
        const user = await this.userRepository.get({ deviceId });
        if (user)
            return user;
        const newUser = await this.userRepository.create(req.body);
        return newUser;
    }
}
exports.default = UserService;
