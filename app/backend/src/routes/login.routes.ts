import { Request, Response, Router } from 'express';
import Middlewares from '../middlewares';
import LoginController from '../controllers/login.controller';

const router = Router();

const loginController = new LoginController();

router.post(
  '/',
  Middlewares.loginMiddleware,
  (req: Request, res: Response) => loginController.login(req, res),
);

router.get('/role', (req: Request, res: Response) => loginController.role(req, res));

export default router;
