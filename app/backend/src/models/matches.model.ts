import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';

export default class MatchModel {
  private sequelizeMatch = SequelizeMatch;

  async findAll(): Promise<SequelizeMatch[]> {
    const matches = await this.sequelizeMatch.findAll({ include:
       [{ model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
         { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } }] });
    return matches;
  }
}
