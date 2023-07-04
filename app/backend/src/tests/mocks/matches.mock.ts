import IMatch from "../../Interfaces/Match"

export const matchesMock: IMatch[] = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,

  },
  {
    "id": 2,
    "homeTeamId": 9,
    "homeTeamGoals": 2,
    "awayTeamId": 14,
    "awayTeamGoals": 1,
    "inProgress": false,
  },
  {
    "id": 46,
    "homeTeamId": 4,
    "homeTeamGoals": 1,
    "awayTeamId": 12,
    "awayTeamGoals": 4,
    "inProgress": false,
}]

export const matchesWithId16InHome = [
  {
    "id": 2,
    "homeTeamId": 16,
    "homeTeamGoals": 3,
    "awayTeamId": 14,
    "awayTeamGoals": 1,
    "inProgress": false,
  },
  {
    "id": 46,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 12,
    "awayTeamGoals": 4,
    "inProgress": false,
  }
]

export const matchesWith16InAway = [
  {
    "id": 2,
    "homeTeamId": 14,
    "homeTeamGoals": 1,
    "awayTeamId": 16,
    "awayTeamGoals": 3,
    "inProgress": false,
  },
  {
    "id": 46,
    "homeTeamId": 12,
    "homeTeamGoals": 5,
    "awayTeamId": 16,
    "awayTeamGoals": 6,
    "inProgress": false,
  },
  {
    "id": 54,
    "homeTeamId": 3,
    "homeTeamGoals": 1,
    "awayTeamId": 16,
    "awayTeamGoals": 1,
    "inProgress": false,
  }
]

export const matchesWith16InBoth = [
  {
    "id": 2,
    "homeTeamId": 16,
    "homeTeamGoals": 12,
    "awayTeamId": 3,
    "awayTeamGoals": 4,
    "inProgress": false,
  },
  {
    "id": 46,
    "homeTeamId": 7,
    "homeTeamGoals": 1,
    "awayTeamId": 16,
    "awayTeamGoals": 10,
    "inProgress": false,
  },
  {
    "id": 45,
    "homeTeamId": 7,
    "homeTeamGoals": 1,
    "awayTeamId": 16,
    "awayTeamGoals": 1,
    "inProgress": false,
  },
  {
    "id": 32,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 7,
    "awayTeamGoals": 2,
    "inProgress": false,
  },
  {
    "id": 33,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 7,
    "awayTeamGoals": 2,
    "inProgress": false,
  },
  {
    "id": 33,
    "homeTeamId": 8,
    "homeTeamGoals": 3,
    "awayTeamId": 16,
    "awayTeamGoals": 2,
    "inProgress": false,
  }
]

export const matchesInProgressMock = [
  {
    "id": 46,
    "homeTeamId": 4,
    "homeTeamGoals": 1,
    "awayTeamId": 12,
    "awayTeamGoals": 1,
    "inProgress": true,}
]

export const matchesDone = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
  },
  {
    "id": 2,
    "homeTeamId": 9,
    "homeTeamGoals": 1,
    "awayTeamId": 14,
    "awayTeamGoals": 1,
    "inProgress": false,
  },
]

export const matchRequestBody = {
  "homeTeamId": 16,
  "awayTeamId": 8,
  "homeTeamGoals": 2,
  "awayTeamGoals": 2,
}

export const matchRequestBodyInvalid = {
  "homeTeamId": 16, // id's iguais 
  "awayTeamId": 16, // unprocessable
  "homeTeamGoals": 2,
  "awayTeamGoals": 2,
}