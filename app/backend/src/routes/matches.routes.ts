import { Request, Response, Router } from 'express';
import MatchController from '../controllers/matches.controller';

const router = Router();

const matchController = new MatchController();

router.get('/', (req: Request, res: Response) => matchController.findAll(req, res));

export default router;
