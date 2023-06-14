import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';

import { Response } from 'superagent';
import { teamMock, teamsMock } from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  // let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(Example, "findOne")
  //     .resolves({
  //       ...<Seu mock>
  //     } as Example);
  // });

  // after(()=>{
  //   (Example.findOne as sinon.SinonStub).restore();
  // })

  // it('...', async () => {
  //   chaiHttpResponse = await chai
  //      .request(app)
  //      ...

  //   expect(...)
  // });

  beforeEach(() => {
    sinon.restore();
  })
  describe('GET /teams', () => { 
    it('deveria retornar os times', async () => {
      const teamsInstance = SequelizeTeam.bulkBuild(teamsMock)
      sinon.stub(SequelizeTeam, 'findAll').resolves(teamsInstance)

      const response = await chai.request(app).get('/teams');

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(teamsMock);
    });
   })

   describe('GET /teams/:id', () => {
    it ('deveria retornar um time baseado em seu id', async () => {
      const teamInstance = SequelizeTeam.build(teamMock);
      sinon.stub(SequelizeTeam, 'findByPk').resolves(teamInstance);

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.be.eq(200);
      expect(response.body).to.be.deep.eq(teamMock);
    })
    it ('deveria retornar erro ao passar um id inexistente', async () => {
      sinon.stub(SequelizeTeam, 'findByPk').resolves(null);

      const response = await chai.request(app).get('/teams/1234');

      expect(response.status).to.be.eq(404);
      expect(response.body).to.have.key('message');
    })
    })
});
