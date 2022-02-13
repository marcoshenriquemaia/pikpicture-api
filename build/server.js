"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const data_1 = __importDefault(require("./data"));
const app_1 = __importDefault(require("./presentation/app"));
const socket_1 = __importDefault(require("./socket"));
const queue_1 = __importDefault(require("./queue"));
dotenv_1.default.config();
async function run() {
    var _a;
    const ENV = {
        PORT: process.env.PORT,
        DB_CONNECTION: process.env.DB_CONNECTION
    };
    const roomQueue = new queue_1.default();
    const models = await (0, data_1.default)({ ENV });
    const app = (0, app_1.default)({ models, ENV, roomQueue });
    const server = (0, socket_1.default)(app, { models, roomQueue });
    server.listen((_a = ENV.PORT) !== null && _a !== void 0 ? _a : 3333, () => console.log(`🚀 Server started on port ${ENV.PORT}`));
}
run();
