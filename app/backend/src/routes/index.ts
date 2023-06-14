import { Request, Response, Router } from 'express';
import teamRoute from './teams.routes';
import Middlewares from '../middlewares';
import LoginController from '../controllers/login.controller';

const router = Router();

const loginController = new LoginController();

router.use('/teams', teamRoute);
router.post(
  '/login',
  Middlewares.loginMiddleware,
  (req: Request, res: Response) => loginController.login(req, res),
);

export default router;
