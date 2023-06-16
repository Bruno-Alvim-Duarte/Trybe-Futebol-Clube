import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboard.service';
import mapStatusHTTP from '../utils/mapStatusHTTP';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) {}

  async getHomeTeamsLeaderboard(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getTeamsLeaderboard('home');
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  async getAwayTeamsLeaderboard(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getTeamsLeaderboard('away');
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  async getAllTeamsLeaderboard(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getTeamsLeaderboard('both');
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
