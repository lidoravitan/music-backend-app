import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { appConfig } from '../conf'

export function authenticateToken(req: Request<Request>, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    res.sendStatus(401)
    return
  }

  jwt.verify(token, appConfig.SECRET, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403)
      return
    }
    req.context = user

    next()
  })
}
