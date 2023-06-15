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

router.patch(
  '/:id',
  Middlewares.tokenMiddleware,
  (req: Request, res: Response) => matchController.updateMatch(req, res),
);

router.post(
  '/',
  Middlewares.tokenMiddleware,
  (req: Request, res: Response) => matchController.createMatch(req, res),
);

export default router;
