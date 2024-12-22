import { Request, Response} from 'express'
import { createSnippetSchema } from '../lib/zod'
import db from '../lib/db'

export async function createSnippet(req: Request, res: Response) {
     try {
         const parsedData = createSnippetSchema.safeParse(req.body)
         if(!parsedData.success) {
            res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
            return
         }
         const { title, language, code} = parsedData.data

         const snippet = await db.snippet.create({data: {title,code,language,userId: 1}})

         res.status(201).json({msg: 'Saved successfully', id: snippet.id})
     } catch(err) {
         console.error(err)
         res.status(500).json({msg: 'Internal server error'})
     }
}