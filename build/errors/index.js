"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
const errorCatcher = (app) => {
    app.use((err, __, response, _) => {
        if (err instanceof AppError_1.default) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message
            });
        }
        console.error(err);
        return response.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    });
};
exports.default = errorCatcher;
