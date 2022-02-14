"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = __importDefault(require("./room/index"));
const user_1 = __importDefault(require("./user"));
const routes = (deps) => {
    const routes = (0, express_1.Router)();
    routes.use('/room', (0, index_1.default)(deps));
    routes.use('/user', (0, user_1.default)(deps));
    return routes;
};
exports.default = routes;
