import { Router } from "express";
import { createSnippet, deleteSnippet, getComments, getSnippet, getSnippets, getStarCount, getStarredSnippets, isStarred, starSnippet } from "../controllers/snippet.ctr";


export const snippetRouter = Router()

snippetRouter.post('/create', createSnippet)
snippetRouter.get('/getSnippets', getSnippets)
snippetRouter.get('/getSnippet/:id', getSnippet)
snippetRouter.delete('/delete/:id', deleteSnippet)
snippetRouter.post('/star/:id', starSnippet)
snippetRouter.get('/star/:id', getStarCount)
snippetRouter.get('/getStarredSnippets', getStarredSnippets)
snippetRouter.get('/isStarred/:id', isStarred)
snippetRouter.get('/get/comments/:id', getComments)