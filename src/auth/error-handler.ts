import { Request, Response, NextFunction } from "express";

export function errorHandlerMiddleware(err: any, req:Request, res:Response, next: NextFunction) {
  if (err) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res
    .status(500)
    .send('Something went wrong try again later')
}

export function notFound(res: Response) {
    return  res.status(404).send('Route does not exist');
}
