import { Router } from "express";
import { createSnippet, deleteSnippet, getSnippet, getSnippets, getStarCount, getStarredSnippets, starSnippet } from "../controllers/snippet.ctr";


export const snippetRouter = Router()

snippetRouter.post('/create', createSnippet)
snippetRouter.get('/getSnippets', getSnippets)
snippetRouter.get('/getSnippet/:id', getSnippet)
snippetRouter.delete('/delete/:id', deleteSnippet)
snippetRouter.post('/star/:id', starSnippet)
snippetRouter.get('/star/:id', getStarCount)
snippetRouter.get('/getStarredSnippets', getStarredSnippets)