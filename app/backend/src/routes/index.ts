import { Router } from 'express';
import teamRoute from './teams.routes';
import loginRoute from './login.routes';
import matchRoute from './matches.routes';
import leaderboardRoute from './leaderboard.routes';

const router = Router();

router.use('/teams', teamRoute);
router.use('/login', loginRoute);
router.use('/matches', matchRoute);
router.use('/leaderboard', leaderboardRoute);

export default router;
