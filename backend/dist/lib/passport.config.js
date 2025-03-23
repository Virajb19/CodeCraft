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
const passport_github2_1 = require("passport-github2");
const db_1 = __importDefault(require("./db"));
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
require("express");
dotenv_1.default.config();
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback'`,
    scope: ['email', 'profile'],
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const user = yield db_1.default.user.findFirst({ where: { OauthId: profile.id } });
        if (user) {
            yield db_1.default.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
            return done(null, { id: user.id, email: user.email, name: user.username, image: (_a = user.ProfilePicture) !== null && _a !== void 0 ? _a : '', isPro: user.isPro });
        }
        else {
            const user = yield db_1.default.user.create({ data: { username: profile.displayName, email: (_d = (_c = (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '', ProfilePicture: ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || null, OauthProvider: profile.provider.toUpperCase(), OauthId: profile.id } });
            return done(null, { id: user.id, email: user.email, name: user.username, image: (_g = user.ProfilePicture) !== null && _g !== void 0 ? _g : '', isPro: user.isPro });
        }
    }
    catch (err) {
        console.error(err);
        return done(err);
    }
})));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || ''
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const provider = profile.provider === 'github' ? 'GITHUB' : 'GOOGLE';
    try {
        const user = yield db_1.default.user.findFirst({ where: { OauthId: profile.id } });
        if (user) {
            yield db_1.default.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
            return done(null, { id: user.id, email: user.email, name: user.username, image: user.ProfilePicture, isPro: user.isPro });
        }
        else {
            const user = yield db_1.default.user.create({ data: { username: (_a = profile.username) !== null && _a !== void 0 ? _a : '', email: ((_c = (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value) || '', lastLogin: new Date(), ProfilePicture: ((_e = (_d = profile.photos) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value) || null, OauthProvider: provider, OauthId: profile.id } });
            return done(null, { id: user.id, email: user.email, name: user.username, image: user.ProfilePicture, isPro: user.isPro });
        }
    }
    catch (err) {
        console.error(err);
        return done(err);
    }
})));
