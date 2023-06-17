import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { oneTeamMock, teamsMock } from './mocks/teams.mock';
import { matchesMock, matchesWith16InAway, matchesWith16InBoth, matchesWithId16InHome } from './mocks/matches.mock';
import { expectedResultAway, expectedResultBoth, expectedResultHome } from './mocks/leaderboard';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('GET /leaderboard/home', () => { 
    it('deveria retornar os dados corretamente', async () => {
      const teamsInstance = SequelizeTeam.bulkBuild(oneTeamMock);
      sinon.stub(SequelizeTeam, 'findAll').resolves(teamsInstance);
      const userInstance = SequelizeMatch.bulkBuild(matchesWithId16InHome);
      sinon.stub(SequelizeMatch, 'findAll').resolves(userInstance);

      const response = await chai.request(app).get('/leaderboard/home').send()

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(expectedResultHome);
    });
  })
  describe('GET /leaderboard/away', () => { 
    it('deveria retornar os dados corretamente', async () => {
      const teamsInstance = SequelizeTeam.bulkBuild(oneTeamMock);
      sinon.stub(SequelizeTeam, 'findAll').resolves(teamsInstance);
      const userInstance = SequelizeMatch.bulkBuild(matchesWith16InAway);
      sinon.stub(SequelizeMatch, 'findAll').resolves(userInstance);

      const response = await chai.request(app).get('/leaderboard/away').send()

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(expectedResultAway);
    });
  })
  describe('GET /leaderboard', () => { 
    it('deveria retornar os dados corretamente', async () => {
      const teamsInstance = SequelizeTeam.bulkBuild(oneTeamMock);
      sinon.stub(SequelizeTeam, 'findAll').resolves(teamsInstance);
      const userInstance = SequelizeMatch.bulkBuild(matchesWith16InBoth);
      sinon.stub(SequelizeMatch, 'findAll').resolves(userInstance);

      const response = await chai.request(app).get('/leaderboard').send()

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(expectedResultBoth);
    });
  })
});
