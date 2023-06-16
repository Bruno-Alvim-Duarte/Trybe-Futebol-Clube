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
  goalsBalance: number,
  efficiency: number,
};

export default class LeaderboardService {
  constructor(
    private teamModel = new TeamModel(),
    private matchModel = new MatchModel(),
  ) {}

  async getTeamsLeaderboard(): Promise<ServiceResponse<Leaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const resultPromises = teams.map(async (team) => {
      const matches = await this.matchModel.findHomeMatchesDoneByTeamId(team.id);
      return {
        name: team.teamName,
        ...LeaderboardService.formatter(matches),
      };
    });
    const result = await Promise.all(resultPromises);
    result.sort(LeaderboardService.sortMethod);
    return { status: 'SUCCESSFUL', data: result };
  }

  private static formatter(matches: SequelizeMatch[]) {
    const { wins, points, draws, losses } = LeaderboardService.matchesResults(matches);
    const { goalsFavor, goalsOwn } = LeaderboardService.goalsResults(matches);
    const goalsBalance = goalsFavor - goalsOwn;
    const efficiency = LeaderboardService.getEfficiency(points, matches.length);
    return {
      totalPoints: points,
      totalGames: matches.length,
      totalVictories: wins,
      totalDraws: draws,
      totalLosses: losses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  private static matchesResults(matches: SequelizeMatch[])
    : { wins: number, points: number, draws: number, losses:number } {
    const results = matches.map((match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        return 'win';
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return 'loss';
      }
      return 'draw';
    });
    const wins = results.filter((result) => result === 'win').length;
    const draws = results.filter((result) => result === 'draw').length;
    const losses = results.filter((result) => result === 'loss').length;

    return { wins, points: wins * 3 + draws, draws, losses };
  }

  private static goalsResults(matches: SequelizeMatch[])
    : { goalsFavor: number, goalsOwn:number } {
    const goalsFavor = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    const goalsOwn = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);

    return { goalsFavor, goalsOwn };
  }

  private static getEfficiency(points: number, games: number): number {
    return +((points / (games * 3)) * 100).toFixed(2);
  }

  private static sortMethod(a: Leaderboard, b: Leaderboard) {
    if (a.totalPoints === b.totalPoints) {
      if (a.totalVictories === b.totalVictories) {
        if (a.goalsBalance === b.goalsBalance) {
          return b.goalsFavor - a.goalsFavor;
        }
        return b.goalsBalance - a.goalsBalance;
      }
      return b.totalVictories - a.totalVictories;
    }
    return b.totalPoints - a.totalPoints;
  }
}
