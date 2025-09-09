type Context = {
  id: number
  iat: number
}

declare namespace Express {
  interface Request {
    context: Context
  }
}
