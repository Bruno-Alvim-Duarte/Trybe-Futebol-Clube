import { Request, Response, Router } from 'express';
import TeamController from '../controllers/teams.controller';

const router = Router();

const teamController = new TeamController();

router.get('/', (req: Request, res: Response) => teamController.findAll(req, res));

export default router;
