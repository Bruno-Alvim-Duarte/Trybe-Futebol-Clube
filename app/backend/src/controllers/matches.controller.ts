import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/matches.service';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  async findAll(_req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.matchService.findAll();
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
