"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db = global.db || new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production') {
    global.db = db;
}
exports.default = db;
