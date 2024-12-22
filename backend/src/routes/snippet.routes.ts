import { Router } from "express";
import { createSnippet } from "../controllers/snippet.ctr";


export const snippetRouter = Router()

snippetRouter.post('/create', createSnippet)