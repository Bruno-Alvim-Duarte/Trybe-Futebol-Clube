import { NextFunction, Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TokenGenerator from '../utils/TokenGenerator';

export default class Middlewares {
  private static emailRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/i;
  private static tokenGenerator = new TokenGenerator();

  static loginMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(mapStatusHTTP('INVALID_DATA'))
        .json({ message: 'All fields must be filled' });
    }

    if (password.length < 6 || !Middlewares.emailRegex.test(email)) {
      return res.status(mapStatusHTTP('UNAUTHORIZED'))
        .json({ message: 'Invalid email or password' });
    }
    next();
  }

  static tokenMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(mapStatusHTTP('UNAUTHORIZED')).json({ message: 'Token not found' });
    }

    try {
      Middlewares.tokenGenerator.verifyToken(authorization);

      next();
    } catch (err) {
      return res.status(mapStatusHTTP('UNAUTHORIZED'))
        .json({ message: 'Token must be a valid token' });
    }
  }
}
