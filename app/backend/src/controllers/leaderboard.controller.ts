import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) {}

  async getTeamsLeaderboard(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getTeamsLeaderboard();
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
