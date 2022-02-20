"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_routes_1 = __importDefault(require("./create.routes"));
const gameMode_routes_1 = __importDefault(require("./gameMode.routes"));
const join_routes_1 = __importDefault(require("./join.routes"));
const roomRouter = (deps) => {
    const router = (0, express_1.Router)();
    router.post('/create', (0, create_routes_1.default)(deps));
    router.put('/join', (0, join_routes_1.default)(deps));
    router.put('/gameMode', (0, gameMode_routes_1.default)(deps));
    return router;
};
exports.default = roomRouter;
