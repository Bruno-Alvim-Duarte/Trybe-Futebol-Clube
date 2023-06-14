import SequelizeTeam from '../database/models/SequelizeTeam';
import ITeam from '../Interfaces/Team';
import { ICRUDModelReader } from '../Interfaces/CRUDModel';

export default class TeamModel implements ICRUDModelReader<ITeam> {
  private sequelizeTeam = SequelizeTeam;

  async findAll(): Promise<ITeam[]> {
    const teams = await this.sequelizeTeam.findAll();
    return teams;
  }

  async findById(id: number): Promise<ITeam | null> {
    const team = await this.sequelizeTeam.findByPk(id);
    return team;
  }
}
