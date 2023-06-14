import { NextFunction, Request, Response } from 'express';

export default function ErrorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  return res.status(500).json({ message: err.message });
}
