"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME = exports.USER = exports.ROOM = void 0;
exports.ROOM = {
    JOIN: 'room:join',
    LEAVE: 'room:leave',
    STATUS: 'room:status',
};
exports.USER = {
    UPDATE: 'user:update',
    STATUS: 'user:status',
    DISCONNECT: 'user:disconnect',
    ALMOST: 'user:almost',
    PUNISHMENT_END: 'user:punishment_end',
    MISS: 'user:miss',
    HIT: 'user:hit'
};
exports.GAME = {
    START: 'game:start',
    END: 'game:end',
    PLAY: 'game:play',
    PUNISHMENT_END: 'game:punishment_end',
    MISS: 'game:miss',
    HIT: 'game:hit',
    UPDATE_MAIN_CARD: 'game:update_main_card',
    TIME: 'game:time'
};
