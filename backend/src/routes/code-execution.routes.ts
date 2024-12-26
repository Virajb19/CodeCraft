import { Router } from "express";
import { createCodeExecution, getExecutions } from "../controllers/code-execution.ctr";

export const executionRouter = Router()

executionRouter.post('/create', createCodeExecution)
executionRouter.get('/getExecutions', getExecutions)
