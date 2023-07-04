import IMatch from '../Interfaces/Match';
import updateMatchBody from '../Interfaces/updateMatchbody';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import MatchModel from '../models/matches.model';
import TeamModel from '../models/teams.model';

export default class MatchService {
  constructor(
    private matchModel = new MatchModel(),
    private teamModel = new TeamModel(),
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

  async createMatch(match: IMatch): Promise<ServiceResponse<Omit<IMatch, 'inProgress'>>> {
    const homeTeam = await this.teamModel.findById(match.homeTeamId);
    const awayTeam = await this.teamModel.findById(match.awayTeamId);
    if (!homeTeam || !awayTeam) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }
    if (match.homeTeamId === match.awayTeamId) {
      return { status: 'UNPROCESSABLE',
        data: { message: 'It is not possible to create a match with two equal teams' } };
    }

    const created = await this.matchModel.createMatch(match);
    return { status: 'CREATED', data: created };
  }
}
