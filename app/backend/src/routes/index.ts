import { Router } from 'express';
import teamRoute from './teams.routes';
import loginRoute from './login.routes';
import matchRoute from './matches.routes';

const router = Router();

router.use('/teams', teamRoute);
router.use('/login', loginRoute);
router.use('/matches', matchRoute);

export default router;
