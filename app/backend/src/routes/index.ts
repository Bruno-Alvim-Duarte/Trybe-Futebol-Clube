import { Router } from 'express';
import teamRoute from './teams.routes';

const router = Router();

router.use('/teams', teamRoute);

export default router;
