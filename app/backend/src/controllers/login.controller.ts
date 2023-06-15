import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import TokenGenerator from '../utils/TokenGenerator';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LoginService from '../services/login.service';

export default class LoginController {
  constructor(
    private loginService = new LoginService(),
    private tokenGenerator = new TokenGenerator(),
  ) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const serviceResponse = await this.loginService.login(email, password);
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  role(req: Request, res: Response): Response | void {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(mapStatusHTTP('UNAUTHORIZED')).json({ message: 'Token not found' });
    }

    try {
      const decode = this.tokenGenerator.verifyToken(authorization) as JwtPayload;

      return res.status(mapStatusHTTP('SUCCESSFUL')).json({ role: decode.role });
    } catch (err) {
      return res.status(mapStatusHTTP('UNAUTHORIZED'))
        .json({ message: 'Token must be a valid token' });
    }
  }
}
