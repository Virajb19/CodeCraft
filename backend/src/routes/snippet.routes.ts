import { Router } from "express";
import { createSnippet, deleteSnippet, getSnippet, getSnippets } from "../controllers/snippet.ctr";


export const snippetRouter = Router()

snippetRouter.post('/create', createSnippet)
snippetRouter.get('/getSnippets', getSnippets)
snippetRouter.get('/getSnippet/:id', getSnippet)
snippetRouter.delete('/delete/:id', deleteSnippet)