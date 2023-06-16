import { ServiceResponse } from '../Interfaces/ServiceResponse';
import SequelizeMatch from '../database/models/SequelizeMatch';
import MatchModel from '../models/matches.model';
import TeamModel from '../models/teams.model';

type Leaderboard = {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
};

export default class LeaderboardService {
  constructor(
    private teamModel = new TeamModel(),
    private matchModel = new MatchModel(),
  ) {}

  async getTeamsLeaderboard(): Promise<ServiceResponse<Leaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const resultPromises = teams.map(async (team) => {
      const matches = await this.matchModel.findByTeamId(team.id);
      return {
        name: team.teamName,
        ...LeaderboardService.formatter(matches, team.id),
      };
    });

    const result = await Promise.all(resultPromises);

    return { status: 'SUCCESSFUL', data: result };
  }

  private static formatter(matches: SequelizeMatch[], teamId: number) {
    const { wins, points, draws, losses } = LeaderboardService.matchesResults(matches, teamId);
    const { goalsFavor, goalsOwn } = LeaderboardService.goalsResults(matches, teamId);
    return {
      totalPoints: points,
      totalGames: matches.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor,
      goalsOwn,
    };
  }

  static matchesResults(matches: SequelizeMatch[], teamId: number)
    : { wins: number, points: number, draws: number, losses:number } {
    const results = matches.map((match) => {
      if (match.homeTeamId === teamId) {
        if (match.homeTeamGoals > match.awayTeamGoals) {
          return 'win';
        }
        return 'loss';
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return 'win';
      }
      return 'loss';
    });
    const wins = results.filter((result) => result === 'win').length;
    const draws = matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
    const losses = results.filter((result) => result === 'loss').length;

    return { wins, points: wins * 3 + draws, draws, losses };
  }

  static goalsResults(matches: SequelizeMatch[], teamId: number)
    : { goalsFavor: number, goalsOwn:number } {
    const goalsFavor = matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) {
        return acc + match.homeTeamGoals;
      }
      return acc + match.awayTeamGoals;
    }, 0);
    const goalsOwn = matches.reduce((acc, match) => {
      if (match.homeTeamId === teamId) {
        return acc + match.awayTeamGoals;
      }
      return acc + match.homeTeamGoals;
    }, 0);

    return { goalsFavor, goalsOwn };
  }
}
