import updateMatchBody from '../Interfaces/updateMatchbody';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../models/matches.model';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
  ) {}

  async findAll(inProgress: boolean | undefined): Promise<ServiceResponse<SequelizeMatch[]>> {
    const matches = await this.matchModel.findAll(inProgress);
    return { status: 'SUCCESSFUL', data: matches };
  }

  async finishMatch(id: number): Promise<ServiceResponse<{ message: string }>> {
    await this.matchModel.finishMatch(id);
    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  async updateMatch(body: updateMatchBody, id: number)
    : Promise<ServiceResponse<{ message: string }>> {
    await this.matchModel.updateMatch(body, id);
    return { status: 'SUCCESSFUL', data: { message: 'Updated' } };
  }
}
