import ITeam from '../Interfaces/Team';
import TeamModel from '../models/teams.model';
import { ICRUDModelReader } from '../Interfaces/CRUDModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private model: ICRUDModelReader<ITeam> = new TeamModel(),
  ) { }

  async findAll(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.model.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }

  async findById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.model.findById(id);
    if (!team) return { status: 'NOT_FOUND', data: { message: 'Team not found' } };
    return { status: 'SUCCESSFUL', data: team };
  }
}
