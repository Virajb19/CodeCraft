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
exports.getProfile = getProfile;
exports.createRoom = createRoom;
exports.joinRoom = joinRoom;
exports.getRoom = getRoom;
exports.leaveRoom = leaveRoom;
exports.createComment = createComment;
exports.deleteComment = deleteComment;
exports.editComment = editComment;
const db_1 = __importDefault(require("../lib/db"));
const zod_1 = require("../lib/zod");
const zod_2 = require("zod");
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('profile');
        try {
            res.status(200).json({ user: req.user || 'user' });
            return;
            if (req.isAuthenticated()) {
                res.status(200).json({ user: req.user });
            }
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function createRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const parsedData = zod_1.createRoomSchema.safeParse(req.body);
            if (!parsedData.success) {
                res.status(400).json({ msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors });
                return;
            }
            const { title } = parsedData.data;
            const room = yield db_1.default.room.create({ data: { title, ownerId: userId } });
            res.status(200).json({ roomId: room.id });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function joinRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const room = yield db_1.default.room.findUnique({ where: { id } });
            if (!room) {
                res.status(404).json({ msg: 'Room not found!' });
                return;
            }
            if (room.ownerId === userId) {
                res.status(403).json({ msg: 'You are the owner of this room' });
                return;
            }
            yield db_1.default.room.update({ where: { id }, data: { participants: { connect: { id: userId } } } });
            res.status(200).json({ msg: 'Joined room successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const room = yield db_1.default.room.findUnique({ where: { id }, include: { owner: { select: { id: true, username: true, ProfilePicture: true } }, participants: { select: { id: true, username: true, ProfilePicture: true } } } });
            if (!room) {
                res.status(404).json({ msg: 'Room not found!' });
                return;
            }
            res.status(200).json({ room });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function leaveRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const room = yield db_1.default.room.findUnique({ where: { id }, include: { participants: { select: { id: true } } } });
            if (!room) {
                res.status(404).json({ msg: 'room not found' });
                return;
            }
            if (room.ownerId === userId) {
                yield db_1.default.room.update({ where: { id: room.id }, data: { deletedAt: new Date() } });
                res.status(203).json({ msg: 'Deleted room successfully' });
                return;
                // await db.room.update({ where: { id }, data: { ownerId: room.participants[0].id}})
            }
            yield db_1.default.room.update({ where: { id }, data: { participants: { disconnect: { id: userId } } } });
            res.status(200).json({ msg: 'Left the room' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function createComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const parsedData = zod_1.createCommentSchema.safeParse(req.body);
            if (!parsedData.success) {
                res.status(400).json({ msg: 'Invalid input', errors: parsedData.error.flatten().fieldErrors });
                return;
            }
            const { content } = parsedData.data;
            const { id } = req.params;
            const snippet = yield db_1.default.snippet.findUnique({ where: { id }, select: { userId: true } });
            if (!snippet) {
                res.status(404).json({ msg: 'snippet not found' });
                return;
            }
            if (snippet.userId === userId) {
                res.status(403).json({ msg: 'You cannot post a comment on your own snippet!' });
                return;
            }
            const comment = yield db_1.default.comment.create({ data: { content, userId, snippetId: id } });
            res.status(201).json({ msg: 'Comment posted!!', commentId: comment.id });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function deleteComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const comment = yield db_1.default.comment.findUnique({ where: { id }, select: { userId: true } });
            if (!comment) {
                res.status(404).json({ msg: 'comment not found!!' });
                return;
            }
            if (comment.userId !== userId) {
                res.status(403).json({ msg: 'You are not authorized to delete this comment' });
                return;
            }
            yield db_1.default.comment.delete({ where: { id } });
            res.status(204).json({ msg: 'comment deleted!' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function editComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const comment = yield db_1.default.comment.findUnique({ where: { id }, select: { id: true, userId: true } });
            if (!comment) {
                res.status(404).json({ msg: 'comment not found!!' });
                return;
            }
            if (comment.userId !== userId) {
                res.status(403).json({ msg: 'You are not authorized to edit this comment' });
                return;
            }
            const parsedData = zod_2.z.object({ newContent: zod_2.z.string() }).safeParse(req.body);
            if (!parsedData.success) {
                res.status(400).json({ msg: 'Invalid input', errors: parsedData.error.flatten().fieldErrors });
                return;
            }
            const { newContent } = parsedData.data;
            yield db_1.default.comment.update({ where: { id: comment.id }, data: { content: newContent } });
            res.status(200).json({ msg: 'comment edited successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Error editing comment' });
        }
    });
}
