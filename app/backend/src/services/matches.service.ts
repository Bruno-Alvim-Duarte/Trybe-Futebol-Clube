import SequelizeMatch from '../database/models/SequelizeMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../models/matches.model';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
  ) {}

  async findAll(): Promise<ServiceResponse<SequelizeMatch[]>> {
    const matches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: matches };
  }
}
