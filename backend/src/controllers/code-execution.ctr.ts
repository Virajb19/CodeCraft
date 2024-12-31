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

export async function getExecutions(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if(!userId) {
        res.status(401).json({msg: 'Not authorized'})
        return
      }

      const executions = await db.codeExecution.findMany({ where: {userId}, orderBy: {createdAt: 'desc'}})
      const executionsInLast24hrs = await db.codeExecution.count({where: {createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}}})

      res.status(200).json({executions, executionsInLast24hrs})

    } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
    }
}

export async function deleteExecution(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      if(!userId) {
        res.status(401).json({msg: 'Not authorized'})
        return
      }

      const { id } = req.params

      const codeExecution = await db.codeExecution.findUnique({where: {id}})
      if(!codeExecution) {
          res.status(404).json({msg: 'CodeExecution not found'})
          return
      }

      if(codeExecution.userId !== userId) {
          res.status(403).json({msg: 'You are not authorized to delete this execution!!'})
          return
      }

      await db.codeExecution.delete({ where: { id: codeExecution.id}})

      res.status(200).json({msg: 'Deleted successfully'})
      
    } catch(err) {
      console.error(err)
      res.status(500).json({msg: 'Internal server error'})
    }
}