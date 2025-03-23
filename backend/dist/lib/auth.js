"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const db_1 = __importDefault(require("./db"));
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(db_1.default, {
        provider: 'postgresql'
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }
    },
    trustedOrigins: [process.env.CLIENT_BASE_URL]
});
