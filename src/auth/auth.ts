import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express";

export function authenticationMiddleware(req: Request, res: Response, next: NextFunction)  {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    req.user = { id: decoded.id, username: decoded.username }
    next()
  } catch (error) {
    res.status(401).send('Not authorized to access this route')
  }
}
