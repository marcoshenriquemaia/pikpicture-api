"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../AppError"));
const bodyRequired = (body, ...props) => {
    const error = [...props].find(prop => !body[prop]);
    if (error)
        throw new AppError_1.default(`${error} is required`);
};
exports.default = bodyRequired;
