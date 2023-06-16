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

type homeOrAway = 'home' | 'away' | 'both';

export default class LeaderboardService {
  constructor(
    private teamModel = new TeamModel(),
    private matchModel = new MatchModel(),
  ) {}

  async getTeamsLeaderboard(homeOrAway: homeOrAway) : Promise<ServiceResponse<Leaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const resultPromises = teams.map(async (team) => {
      let matches;
      if (homeOrAway === 'home') {
        matches = await this.matchModel.findHomeMatchesDoneByTeamId(team.id);
      } else if (homeOrAway === 'away') {
        matches = await this.matchModel.findAwayMatchesDoneByTeamId(team.id);
      } else {
        matches = await this.matchModel.findAllMatchesDoneByTeamId(team.id);
      }
      return {
        name: team.teamName,
        ...LeaderboardService.formatter(matches, homeOrAway, team.id),
      };
    });
    const result = await Promise.all(resultPromises);
    result.sort(LeaderboardService.sortMethod);
    return { status: 'SUCCESSFUL', data: result };
  }

  private static formatter(matches: SequelizeMatch[], homeOrAway: homeOrAway, teamId: number) {
    const { wins, points, draws, losses } = LeaderboardService
      .matchesResults(matches, homeOrAway, teamId);
    const { goalsFavor, goalsOwn } = LeaderboardService.goalsResults(matches, homeOrAway, teamId);
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
    homeOrAway: homeOrAway,
    teamId: number,
  ) : { wins: number, points: number, draws: number, losses:number } {
    const enemy = homeOrAway === 'home' ? 'awayTeamGoals' : 'homeTeamGoals';
    const curr = homeOrAway === 'home' ? 'homeTeamGoals' : 'awayTeamGoals';
    let results;
    if (homeOrAway === 'home' || homeOrAway === 'away') {
      results = matches.map(
        (match) => LeaderboardService.winsCheckerHomeOrAway(match, curr, enemy),
      );
    } else {
      results = matches.map((match) => LeaderboardService.winsCheckerBoth(match, teamId));
    }
    const wins = results.filter((result) => result === 'win').length;
    const draws = results.filter((result) => result === 'draw').length;
    const losses = results.filter((result) => result === 'loss').length;
    return { wins, points: wins * 3 + draws, draws, losses };
  }

  private static winsCheckerBoth(match: SequelizeMatch, teamId: number) {
    if (match.homeTeamId === teamId) {
      if (match.homeTeamGoals > match.awayTeamGoals) {
        return 'win';
      }
      if (match.awayTeamGoals > match.homeTeamGoals) {
        return 'loss';
      }
      return 'draw';
    }
    if (match.awayTeamGoals > match.homeTeamGoals) {
      return 'win';
    }
    if (match.homeTeamGoals > match.awayTeamGoals) {
      return 'loss';
    }
    return 'draw';
  }

  private static winsCheckerHomeOrAway(
    match: SequelizeMatch,
    curr: 'homeTeamGoals' | 'awayTeamGoals',
    enemy: 'homeTeamGoals' | 'awayTeamGoals',
  ): 'win' | 'loss' | 'draw' {
    if (match[curr] > match[enemy]) {
      return 'win';
    }
    if (match[enemy] > match[curr]) {
      return 'loss';
    }
    return 'draw';
  }

  private static goalsResults(matches: SequelizeMatch[], homeOrAway: homeOrAway, teamId: number)
    : { goalsFavor: number, goalsOwn:number } {
    let goalsFavor;
    let goalsOwn;
    if (homeOrAway === 'home') {
      goalsFavor = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
      goalsOwn = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    } else if (homeOrAway === 'away') {
      goalsFavor = matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
      goalsOwn = matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    } else {
      goalsFavor = matches.reduce((acc, match) => LeaderboardService
        .getGoalsFavorBoth(acc, match, teamId), 0);
      goalsOwn = matches.reduce((acc, match) => LeaderboardService
        .getGoalsOwnBoth(acc, match, teamId), 0);
    }
    return { goalsFavor, goalsOwn };
  }

  private static getGoalsFavorBoth(acc: number, match: SequelizeMatch, teamId: number): number {
    if (match.homeTeamId === teamId) {
      return acc + match.homeTeamGoals;
    }
    return acc + match.awayTeamGoals;
  }

  private static getGoalsOwnBoth(acc: number, match: SequelizeMatch, teamId: number): number {
    if (match.homeTeamId === teamId) {
      return acc + match.awayTeamGoals;
    }
    return acc + match.homeTeamGoals;
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
