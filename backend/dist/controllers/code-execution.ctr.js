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
exports.createCodeExecution = createCodeExecution;
exports.getExecutions = getExecutions;
exports.deleteExecution = deleteExecution;
const db_1 = __importDefault(require("../lib/db"));
const zod_1 = require("../lib/zod");
function createCodeExecution(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const parsedData = zod_1.createCodeExecutionSchema.safeParse(req.body);
            if (!parsedData.success) {
                res.status(400).json({ msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors });
                // console.log(parsedData.error.flatten().fieldErrors)
                return;
            }
            const { language, code, output, error } = parsedData.data;
            const codeExecution = yield db_1.default.codeExecution.create({ data: { language, code, output, error, userId } });
            res.status(201).json({ id: codeExecution.id });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function getExecutions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const executions = yield db_1.default.codeExecution.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
            const executionsInLast24hrs = yield db_1.default.codeExecution.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } });
            res.status(200).json({ executions, executionsInLast24hrs });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
function deleteExecution(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ msg: 'Not authorized' });
                return;
            }
            const { id } = req.params;
            const codeExecution = yield db_1.default.codeExecution.findUnique({ where: { id } });
            if (!codeExecution) {
                res.status(404).json({ msg: 'CodeExecution not found' });
                return;
            }
            if (codeExecution.userId !== userId) {
                res.status(403).json({ msg: 'You are not authorized to delete this execution!!' });
                return;
            }
            yield db_1.default.codeExecution.delete({ where: { id: codeExecution.id } });
            res.status(200).json({ msg: 'Deleted successfully' });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
