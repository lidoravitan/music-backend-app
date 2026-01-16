import { NextFunction, Request, Response } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500

  res.status(status).json({
    error: true,
    message: err.message || 'Internal Server Error',
  })
}
