import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { matchRequestBody, matchesDone, matchesInProgressMock, matchesMock } from './mocks/matches.mock';
import SequelizeMatch from '../database/models/SequelizeMatch';
import TokenGenerator from '../utils/TokenGenerator';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { oneTeamMock, teamsMock } from './mocks/teams.mock';

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

   describe('PATCH /matches/:id/finish', () => { 
    it('deveria ser possível finalizar uma partida com sucesso', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})
      sinon.stub(SequelizeMatch, 'update').resolves();

      const response = await chai.request(app).patch('/matches/2/finish').set('Authorization', 'bla');

      expect(response.status).to.be.eq(200);
      expect(response.body.message).to.be.eq("Finished");
    })
   })

   describe('PATCH /matches/:id', () => { 
    it('deveria ser possível atualizar uma partida com sucesso', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})
      sinon.stub(SequelizeMatch, 'update').resolves();

      const response = await chai.request(app).patch('/matches/2').set('Authorization', 'bla');

      expect(response.status).to.be.eq(200);
      expect(response.body.message).to.be.eq("Updated");
    })
   })
   
   describe('POST /matches', () => { 
    it('deveria ser possível criar uma partida com sucesso', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})
      const team1Instance = SequelizeTeam.build(oneTeamMock[0]);
      const team2Instance = SequelizeTeam.build(teamsMock[1]);
      const matchInstance = SequelizeMatch.build({ ...matchRequestBody, id: 1, inProgress: true })
      sinon.stub(SequelizeTeam, 'findByPk').onFirstCall().resolves(team1Instance).onSecondCall().resolves(team2Instance);
      sinon.stub(SequelizeMatch, 'create').resolves(matchInstance);

      const response = await chai.request(app).post('/matches').set('Authorization', 'bla').send(matchRequestBody);

      expect(response.status).to.be.eq(201);
      expect(response.body).to.be.deep.eq({...matchRequestBody, id: 1, inProgress: true });
    })
    it('não deveria ser possível criar uma partida com um time inexistente', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})
      const team1Instance = SequelizeTeam.build(oneTeamMock[0]);
      sinon.stub(SequelizeTeam, 'findByPk').onFirstCall().resolves(team1Instance).onSecondCall().resolves(null);
      const response = await chai.request(app).post('/matches').set('Authorization', 'bla');

      expect(response.status).to.be.eq(404);
      expect(response.body.message).to.be.eq("There is no team with such id!");
    })
    it('não deveria ser possível criar uma partida com times com ids iguais', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})
      const team1Instance = SequelizeTeam.build(oneTeamMock[0]);
      const team2Instance = SequelizeTeam.build(oneTeamMock[0]);
      sinon.stub(SequelizeTeam, 'findByPk').onFirstCall().resolves(team1Instance).onSecondCall().resolves(team2Instance);
      const response = await chai.request(app).post('/matches').set('Authorization', 'bla');

      expect(response.status).to.be.eq(422);
      expect(response.body.message).to.be.eq("It is not possible to create a match with two equal teams");
    })
   })

});
