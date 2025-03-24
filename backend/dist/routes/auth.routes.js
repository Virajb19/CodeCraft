"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const db_1 = __importDefault(require("../lib/db"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get('/github', passport_1.default.authenticate('github', { scope: ["user:email"] }));
exports.authRouter.get('/callback/github', (req, res, next) => {
    passport_1.default.authenticate('github', { failureRedirect: process.env.CLIENT_BASE_URL }, (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            return res.redirect(process.env.CLIENT_BASE_URL); // Redirect on failure
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            return res.redirect(process.env.CLIENT_BASE_URL + '/editor'); // Redirect on success
        });
    })(req, res, next);
});
exports.authRouter.get('/google', passport_1.default.authenticate('google', { scope: ['email', 'profile'] }));
exports.authRouter.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: process.env.CLIENT_BASE_URL,
    failureRedirect: process.env.CLIENT_BASE_URL
}));
exports.authRouter.get('/check', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.isAuthenticated()) {
        res.json({ user: null });
        return;
    }
    // console.log(req.isAuthenticated())
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.json({ user: null });
        return;
    }
    try {
        const user = yield db_1.default.user.findUnique({ where: { id: userId }, select: { id: true, email: true, username: true, ProfilePicture: true, isPro: true } });
        if (!user) {
            res.json({ user: null });
            return;
        }
        const formattedUser = {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.ProfilePicture,
            isPro: user.isPro
        };
        res.json({ user: formattedUser });
    }
    catch (err) {
        console.error('Error fetching user', err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
}));
exports.authRouter.delete('/logout', auth_middleware_1.isAuthenticated, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.status(200).json({ message: "Logged out" });
    });
});
