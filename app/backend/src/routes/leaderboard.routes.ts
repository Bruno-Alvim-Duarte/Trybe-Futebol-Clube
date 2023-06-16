import { Request, Response, Router } from 'express';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = Router();

const leaderboardController = new LeaderboardController();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getHomeTeamsLeaderboard(req, res),
);
router.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.getAwayTeamsLeaderboard(req, res),
);

export default router;
