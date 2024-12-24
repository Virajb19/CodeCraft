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

        // compare Ids

        const { id } = req.params
        await db.snippet.delete({ where: {id}})

        res.status(204).json({msg: 'Deleted snippet successfully'})

    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
}
