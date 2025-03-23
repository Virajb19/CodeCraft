"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
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
exports.authRouter.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.send({ user: req.user });
    }
    else {
        res.send({ user: null });
    }
});
exports.authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.json({ message: "Logged out" });
    });
});
