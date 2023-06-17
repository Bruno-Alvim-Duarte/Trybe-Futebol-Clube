import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import SequelizeUser from '../database/models/SequelizeUser';
import { bodyInvalidEmail, bodyInvalidPass, bodyWithoutEmail, bodyWithoutPass, jwtTokenAdmin, userMock, validBody, validBodyWrongPass } from './mocks/login.mock';
import TokenGenerator from '../utils/TokenGenerator';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login', () => {

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

   describe('get /login/role', () => {
    it('deveria retornar a role correta', async () => {
      sinon.stub(TokenGenerator.prototype, 'verifyToken').returns({ email: 'bruno@gmail.com', role: 'admin'})

      const response = await chai.request(app).get('/login/role').set('Authorization', jwtTokenAdmin);

      expect(response.status).to.be.eq(200);
      console.log(response.body);
      expect(response.body.role).to.be.eq('admin');
    })
    it ('deveria retornar erro ao tentar buscar uma role sem o token', async () => {
      const response = await chai.request(app).get('/login/role').send();

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
    it ('deveria retornar erro ao tentar buscar uma role com um token invalido', async () => {
      const response = await chai.request(app).get('/login/role').set('Authorization', 'invalido');

      expect(response.status).to.be.eq(401);
      expect(response.body).to.have.key('message');
    })
  })
});
