import SequelizeTeam from '../database/models/SequelizeTeam';
import SequelizeMatch from '../database/models/SequelizeMatch';

export default class MatchModel {
  private sequelizeMatch = SequelizeMatch;

  async findAll(inProgress: boolean | undefined): Promise<SequelizeMatch[]> {
    if (inProgress === true) {
      const matches = await this.sequelizeMatch.findAll({ include:
        [{ model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } }],
      where: { inProgress: true } });
      return matches;
    }
    if (inProgress === false) {
      const matches = await this.sequelizeMatch.findAll({ include:
        [{ model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } }],
      where: { inProgress: false } });
      return matches;
    }
    const matches = await this.sequelizeMatch.findAll({ include:
         [{ model: SequelizeTeam, as: 'homeTeam', attributes: { exclude: ['id'] } },
           { model: SequelizeTeam, as: 'awayTeam', attributes: { exclude: ['id'] } }] });
    return matches;
  }
}
