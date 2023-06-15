import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { matchesDone, matchesInProgressMock, matchesMock } from './mocks/matches.mock';
import SequelizeMatch from '../database/models/SequelizeMatch';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches', () => {
  beforeEach(() => {
    sinon.restore();
  })
  describe('GET /matches', () => { 
    it('deveria retornar todas as partidas quando não passar nenhum filtro', async () => {
      const matchesInstance = SequelizeMatch.bulkBuild(matchesMock)
      sinon.stub(SequelizeMatch, 'findAll').resolves(matchesInstance)

      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(matchesMock);
    });
    it('deveria retornar só as partidas em progresso quando passar o filtro de inProgress true', async () => {
      const matchesInstance = SequelizeMatch.bulkBuild(matchesInProgressMock)
      sinon.stub(SequelizeMatch, 'findAll').resolves(matchesInstance)

      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(matchesInProgressMock);
    });
    it('deveria retornar só as partidas finalizadas quando passar o filtro de inProgress false', async () => {
      const matchesInstance = SequelizeMatch.bulkBuild(matchesDone)
      sinon.stub(SequelizeMatch, 'findAll').resolves(matchesInstance)

      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(matchesDone);
    });
   })
});
