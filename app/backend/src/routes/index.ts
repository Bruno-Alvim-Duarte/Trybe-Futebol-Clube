import { Router } from 'express';
import teamRoute from './teams.routes';
import loginRoute from './login.routes';

const router = Router();

router.use('/teams', teamRoute);
router.use('/login', loginRoute);

export default router;
