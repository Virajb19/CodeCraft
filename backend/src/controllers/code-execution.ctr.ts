import { Request, Response} from 'express'
import db from '../lib/db'
import { createCodeExecutionSchema } from '../lib/zod'

export async function createCodeExecution(req: Request, res: Response) {
  try {

       const userId = req.user?.id
       if(!userId) {
         res.status(401).json({msg: 'Not authorized'})
         return
       }

       const parsedData = createCodeExecutionSchema.safeParse(req.body)
       if(!parsedData.success) {
          res.status(400).json({msg: 'Invalid inputs', errors: parsedData.error.flatten().fieldErrors})
          // console.log(parsedData.error.flatten().fieldErrors)
          return
       }
       
       const { language, code, output, error } = parsedData.data
       const codeExecution = await db.codeExecution.create({data: {language, code, output, error, userId}})

       res.status(201).json({id: codeExecution.id})
  } catch(err) {
    console.error(err) 
    res.status(500).json({msg: 'Internal server error'})
  }
}