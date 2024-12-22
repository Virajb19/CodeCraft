import { Router } from "express";
import { createCodeExecution } from "../controllers/code-execution.ctr";

export const executionRouter = Router()

executionRouter.post('/create', createCodeExecution)
