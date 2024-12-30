import { Request, Response} from 'express'
import { createSnippetSchema } from '../lib/zod'
import db from '../lib/db'

export async function createSnippet(req: Request, res: Response) {
     try {

        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
        }
 
         const parsedData = createSnippetSchema.safeParse(req.body)
         if(!parsedData.success) {
            res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
            return
         }
         const { title, language, code} = parsedData.data

         const snippet = await db.snippet.create({data: {title,code,language,userId}})

         res.status(201).json({msg: 'Saved successfully', id: snippet.id})
     } catch(err) {
         console.error(err)
         res.status(500).json({msg: 'Internal server error'})
     }
}

export async function getSnippets(req: Request, res: Response) {
    try {

        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
        } 

         const snippets = await db.snippet.findMany({ where: { userId}, orderBy: { createdAt: 'desc'}})
         res.status(200).json({snippets})
    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}

export async function getSnippet(req: Request, res: Response) {
    try {

        const { id } = req.params

        const snippet = await db.snippet.findUnique({ where: {id}})
        
        res.status(200).json({snippet})

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}

export async function deleteSnippet(req: Request, res: Response) {
    try {

        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
        } 

        const { id } = req.params

        const snippet = await db.snippet.findUnique({where: {id}})
        if(!snippet) {
            res.status(404).json({msg: 'Snippet not found'})
            return
        }

        if(snippet.userId !== userId) {
            res.status(403).json({msg: 'You are not authorized to delete this snippet!!'})
            return
        }

        await db.snippet.delete({ where: {id}})

        res.status(204).json({msg: 'Deleted snippet successfully'})

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}

export async function starSnippet(req: Request, res: Response) {
    try {

        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
        } 

        const { id } = req.params

        const existingStar = await db.star.findFirst({where: {snippetId: id, userId}})

        if(existingStar) {
           await db.star.delete({where: {id: existingStar.id}})
           const starCount = await db.star.count({where: {snippetId: id}})
           res.status(203).json({ isStarred: false, starCount})
           return
        } 

        await db.star.create({data: {userId, snippetId: id}})
        const starCount = await db.star.count({where: {snippetId: id}})
        res.status(201).json({ isStarred: true, starCount})
    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}

export async function getStarredSnippets(req: Request, res: Response) {
    try {
        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
        } 

        const snippets = await db.snippet.findMany({where: {userId, stars: {some: {userId}}}, include: {stars: true}})

        res.status(200).json({starredSnippets: snippets})

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}

export async function getStarCount(req: Request, res: Response) {
   try {
        const userId = req.user?.id
            if(!userId) {
            res.status(401).json({msg: 'Not authorized'})
            return
        } 

        const { id } = req.params

        const starCount = await db.star.count({ where: { snippetId: id}})

        res.status(200).json({starCount: starCount})
   } catch(err) {
    console.error(err)
    res.status(500).json({msg: 'Internal server error'})
   }
}

export async function isStarred(req: Request, res: Response) {
    try {
        const userId = req.user?.id
        if(!userId) {
        res.status(401).json({msg: 'Not authorized'})
        return
    } 

    const { id } = req.params

    const star = await db.star.findFirst({ where: {userId,snippetId: id}})

    res.status(200).json({isStarred: !!star})

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}