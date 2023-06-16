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

  async getTeamsLeaderboard(homeOrAway: 'home' | 'away'): Promise<ServiceResponse<Leaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const resultPromises = teams.map(async (team) => {
      let matches;
      if (homeOrAway === 'home') {
        matches = await this.matchModel.findHomeMatchesDoneByTeamId(team.id);
      } else {
        matches = await this.matchModel.findAwayMatchesDoneByTeamId(team.id);
      }
      return {
        name: team.teamName,
        ...LeaderboardService.formatter(matches, homeOrAway),
      };
    });
    const result = await Promise.all(resultPromises);
    result.sort(LeaderboardService.sortMethod);
    return { status: 'SUCCESSFUL', data: result };
  }

  private static formatter(matches: SequelizeMatch[], homeOrAway: 'home' | 'away') {
    const { wins, points, draws, losses } = LeaderboardService.matchesResults(matches, homeOrAway);
    const { goalsFavor, goalsOwn } = LeaderboardService.goalsResults(matches, homeOrAway);
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

  private static matchesResults(
    matches: SequelizeMatch[],
    homeOrAway: 'home' | 'away',
  ) : { wins: number, points: number, draws: number, losses:number } {
    const enemy = homeOrAway === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    const curr = homeOrAway === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    const results = matches.map((match) => {
      if (match[curr] > match[enemy]) {
        return 'win';
      }
      if (match[enemy] > match[curr]) {
        return 'loss';
      }
      return 'draw';
    });
    const wins = results.filter((result) => result === 'win').length;
    const draws = results.filter((result) => result === 'draw').length;
    const losses = results.filter((result) => result === 'loss').length;
    return { wins, points: wins * 3 + draws, draws, losses };
  }

  private static goalsResults(matches: SequelizeMatch[], homeOrAway: 'home' | 'away')
    : { goalsFavor: number, goalsOwn:number } {
    let goalsFavor;
    let goalsOwn;
    if (homeOrAway === 'home') {
      goalsFavor = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
      goalsOwn = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    } else {
      goalsFavor = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
      goalsOwn = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    }

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
