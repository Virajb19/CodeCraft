"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionRouter = void 0;
const express_1 = require("express");
const code_execution_ctr_1 = require("../controllers/code-execution.ctr");
exports.executionRouter = (0, express_1.Router)();
exports.executionRouter.post('/create', code_execution_ctr_1.createCodeExecution);
exports.executionRouter.get('/getExecutions', code_execution_ctr_1.getExecutions);
exports.executionRouter.delete('/delete/:id', code_execution_ctr_1.deleteExecution);
