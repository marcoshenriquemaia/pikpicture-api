"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upsert_routes_1 = __importDefault(require("./upsert.routes"));
const userRouter = (deps) => {
    const router = (0, express_1.Router)();
    router.put('/login', (0, upsert_routes_1.default)(deps));
    return router;
};
exports.default = userRouter;
