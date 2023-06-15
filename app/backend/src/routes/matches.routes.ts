import { Request, Response, Router } from 'express';
import MatchController from '../controllers/matches.controller';
import Middlewares from '../middlewares';

const router = Router();

const matchController = new MatchController();

router.get('/', (req: Request, res: Response) => matchController.findAll(req, res));

router.patch(
  '/:id/finish',
  Middlewares.tokenMiddleware,
  (req: Request, res: Response) => matchController.finishMatch(req, res),
);

export default router;
