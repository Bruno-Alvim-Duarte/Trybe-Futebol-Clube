import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import TeamService from '../services/teams.service';

export default class TeamController {
  constructor(
    private teamService = new TeamService(),
  ) {}

  async findAll(_req: Request, res: Response): Promise<Response> {
    const serviceResponse = await this.teamService.findAll();
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const serviceResponse = await this.teamService.findById(+id);
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
