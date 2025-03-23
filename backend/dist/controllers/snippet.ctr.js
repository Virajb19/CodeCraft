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
exports.createSnippet = createSnippet;
exports.getSnippets = getSnippets;
exports.getSnippet = getSnippet;
exports.deleteSnippet = deleteSnippet;
exports.starSnippet = starSnippet;
exports.getStarredSnippets = getStarredSnippets;
exports.getStarCount = getStarCount;
exports.isStarred = isStarred;
exports.getComments = getComments;
const zod_1 = require("../lib/zod");
const db_1 = __importDefault(require("../lib/db"));
function createSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const parsedData = zod_1.createSnippetSchema.safeParse(req.body);
            if (!parsedData.success) {
                res.status(400).json({ msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors });
                return;
            }
            const { title, language, code } = parsedData.data;
            const snippet = yield db_1.default.snippet.create({ data: { title, code, language, userId } });
            res.status(201).json({ msg: 'Saved successfully', id: snippet.id });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getSnippets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const snippets = yield db_1.default.snippet.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
            res.status(200).json({ snippets });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const snippet = yield db_1.default.snippet.findUnique({ where: { id }, include: { comments: { orderBy: { createdAt: 'asc' }, include: { author: { select: { ProfilePicture: true } } } } } });
            if (!snippet) {
                res.status(404).json({ msg: 'Snippet not found' });
                return;
            }
            res.status(200).json({ snippet });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function deleteSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const snippet = yield db_1.default.snippet.findUnique({ where: { id }, select: { id: true, userId: true } });
            if (!snippet) {
                res.status(404).json({ msg: 'Snippet not found' });
                return;
            }
            if (snippet.userId !== userId) {
                res.status(403).json({ msg: 'You are not authorized to delete this snippet!!' });
                return;
            }
            yield db_1.default.snippet.delete({ where: { id } });
            res.status(204).json({ msg: 'Deleted snippet successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function starSnippet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const existingStar = yield db_1.default.star.findFirst({ where: { snippetId: id, userId } });
            if (existingStar) {
                yield db_1.default.star.delete({ where: { id: existingStar.id } });
                const starCount = yield db_1.default.star.count({ where: { snippetId: id } });
                res.status(203).json({ isStarred: false, starCount });
                return;
            }
            yield db_1.default.star.create({ data: { userId, snippetId: id } });
            const starCount = yield db_1.default.star.count({ where: { snippetId: id } });
            res.status(201).json({ isStarred: true, starCount });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getStarredSnippets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const snippets = yield db_1.default.snippet.findMany({ where: { userId, stars: { some: { userId } } }, include: { stars: { orderBy: { createdAt: 'desc' } } } });
            res.status(200).json({ starredSnippets: snippets });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getStarCount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const starCount = yield db_1.default.star.count({ where: { snippetId: id } });
            res.status(200).json({ starCount: starCount });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function isStarred(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const star = yield db_1.default.star.findFirst({ where: { userId, snippetId: id } });
            res.status(200).json({ isStarred: !!star });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const comments = yield db_1.default.comment.findMany({ where: { snippetId: id }, orderBy: { createdAt: 'asc' }, include: { author: { select: { ProfilePicture: true, username: true } } } });
            res.status(200).json({ comments });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
