"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_promise_1 = __importDefault(require("queue-promise"));
class RoomQueue {
    constructor() {
        this.queueList = new Map();
    }
    createQueue(hash, specs) {
        if (this.queueList.has(hash))
            return;
        const formatedSpecs = specs !== null && specs !== void 0 ? specs : {};
        this.queueList.set(hash, new queue_promise_1.default({
            interval: 1,
            concurrent: 1,
            ...formatedSpecs,
        }));
    }
    enqueue(hash, func) {
        const queue = this.queueList.get(hash);
        if (!queue)
            return;
        console.log('hash', queue.tasks.size);
        queue.enqueue(() => new Promise((resolver) => func(resolver, queue.tasks.size + 1)));
    }
    removeQueue(hash) {
        this.queueList.delete(hash);
    }
}
exports.default = RoomQueue;
