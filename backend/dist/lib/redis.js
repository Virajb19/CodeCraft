"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
if (process.env.NODE_ENV === 'developnment') {
    exports.redis = new ioredis_1.Redis({
        host: 'localhost',
        port: 6379
    });
}
