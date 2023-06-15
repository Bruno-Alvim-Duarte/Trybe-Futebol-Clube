import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/matches.service';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import SequelizeMatch from '../database/models/SequelizeMatch';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
  ) {}

  async findAll(req: Request, res: Response): Promise<Response> {
    const { inProgress } = req.query;
    let serviceResponse: ServiceResponse<SequelizeMatch[]>;
    if (inProgress === 'true') {
      serviceResponse = await this.matchService.findAll(true);
    } else if (inProgress === 'false') {
      serviceResponse = await this.matchService.findAll(false);
    } else {
      serviceResponse = await this.matchService.findAll(undefined);
    }
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const serviceResponse = await this.matchService.finishMatch(+id);
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
