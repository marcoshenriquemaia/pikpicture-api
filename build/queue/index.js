"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_promise_1 = __importDefault(require("queue-promise"));
class RoomQueue {
    constructor() {
        this.queueList = {};
    }
    createQueue(hash) {
        if (this.queueList[hash])
            return;
        this.queueList[hash] = new queue_promise_1.default({
            interval: 1,
            concurrent: 1,
            start: true
        });
    }
    enqueue(hash, func) {
        const queue = this.queueList[hash];
        if (!queue)
            return;
        queue.enqueue(() => new Promise((resolver) => func(resolver, queue.uniqueId)));
    }
}
exports.default = RoomQueue;
