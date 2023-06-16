import IMatch from '../Interfaces/Match';
import updateMatchBody from '../Interfaces/updateMatchbody';
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

  async findByHomeAndAwayId(homeTeamId: number, awayTeamId: number) {
    return this.sequelizeMatch.findOne({ where: { homeTeamId, awayTeamId } });
  }

  async findHomeMatchesDoneByTeamId(teamId:number) {
    return this.sequelizeMatch.findAll(
      { where: { homeTeamId: teamId, inProgress: false } },
    );
  }

  async finishMatch(id: number) {
    return this.sequelizeMatch.update({ inProgress: false }, { where: { id } });
  }

  async updateMatch(
    { homeTeamGoals, awayTeamGoals }: updateMatchBody,
    id: number,
  ) {
    return this.sequelizeMatch.update({ homeTeamGoals, awayTeamGoals }, { where: { id } });
  }

  async createMatch(match: IMatch): Promise<Omit<IMatch, 'inProgress'>> {
    return this.sequelizeMatch.create({ ...match, inProgress: true });
  }
}
