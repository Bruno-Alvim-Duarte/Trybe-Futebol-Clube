import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import SequelizeUser from '../database/models/SequelizeUser';
import { bodyInvalidEmail, bodyInvalidPass, bodyWithoutEmail, bodyWithoutPass, userMock, validBody, validBodyWrongPass } from './mocks/login.mock';

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
  describe('POST /login', () => { 
    it('deveria retornar um token ao logar corretamente', async () => {
      const userInstance = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(userInstance);

      const response = await chai.request(app).post('/login').send(validBody)

      expect(response.status).to.be.eq(200);
      expect(response.body).to.have.key('token');
    });
    it('deveria retornar erro ao tentar logar sem email', async () => {
      const response = await chai.request(app).post('/login').send(bodyWithoutEmail)

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.key('message');
    })
    it('deveria retornar erro ao tentar logar sem password', async () => {
      const response = await chai.request(app).post('/login').send(bodyWithoutPass)

      expect(response.status).to.be.eq(400);
      expect(response.body).to.have.key('message');
    })
    it('deveria retornar erro ao tentar logar com email invalido', async () => {
      const response = await chai.request(app).post('/login').send(bodyInvalidEmail)

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
    it('deveria retornar erro ao tentar logar com senha invalida', async () => {
      const response = await chai.request(app).post('/login').send(bodyInvalidPass)

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
    it('deveria retornar erro ao tentar logar com email de um usuario inexistente', async () => {
      sinon.stub(SequelizeUser, 'findOne').resolves(null);

      const response = await chai.request(app).post('/login').send(validBody)

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
    it('deveria retornar erro ao tentar logar com email de um usuario inexistente', async () => {
      const userInstance = SequelizeUser.build(userMock);
      sinon.stub(SequelizeUser, 'findOne').resolves(userInstance);

      const response = await chai.request(app).post('/login').send(validBodyWrongPass)

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
   })
});