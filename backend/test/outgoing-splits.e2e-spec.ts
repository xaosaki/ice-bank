import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { OutgoingSplitsModule } from '../src/outgoing-splits/outgoing-splits.module';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { User } from '../src/common/models/user.model';
import { Transaction } from '../src/common/models/transaction.model';
import { getFakeUser } from './utils/utils';
import { TokenModule } from '../src/common/modules/token/token.module';
import { SplitPart } from '../src/common/models/split-part.model';
import { Split } from '../src/common/models/split.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Merchant } from '../src/common/models/merchant.model';
import { Account } from '../src/common/models/account.model';

describe('OutgoingSplitsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let recipientUser: User;
  let token: string;
  let testAccount: Account;
  let transaction: Transaction;
  let transaction2: Transaction;
  let merchant: Merchant;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TokenModule,
        SequelizeModule.forFeature([User, Account, Merchant]),
        OutgoingSplitsModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await SplitPart.destroy({ where: {}, force: true, truncate: true });
    await Split.destroy({ where: {}, force: true, truncate: true });
    await Transaction.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await app.close();
  });

  beforeEach(async () => {
    const userData = await getFakeUser();
    testUser = await User.create(userData);
    recipientUser = await User.create(await getFakeUser());
    token = jwtService.sign({ username: testUser.email, sub: testUser.userId });
    const accountId = faker.string.uuid();

    merchant = await Merchant.create({
      merchantId: faker.string.uuid(),
      name: 'Amazon',
      logo: 'https://logo.com/amazon.png'
    });

    testAccount = await Account.create({
      accountId: accountId,
      userId: testUser.userId,
      balance: 500.0,
      currency: 'CAD'
    });

    transaction = await Transaction.create({
      transactionId: faker.string.uuid(),
      accountId: testAccount.accountId,
      userId: testUser.userId,
      amount: 200.0,
      description: 'Group Dinner',
      date: new Date(),
      category: 'Dining',
      merchant: merchant.merchantId
    });

    transaction2 = await Transaction.create({
      transactionId: faker.string.uuid(),
      accountId: testAccount.accountId,
      userId: testUser.userId,
      amount: 400.0,
      description: 'Group Breakfast',
      date: new Date(),
      category: 'Dining',
      merchant: merchant.merchantId
    });
  });

  describe('/v1/splits/outgoing (POST)', () => {
    it('should create a new split with valid data', async () => {
      const splitId = faker.string.uuid();

      const response = await request(app.getHttpServer())
        .post('/v1/splits/outgoing')
        .set('Authorization', `Bearer ${token}`)
        .send({
          splitId,
          transactionId: transaction.transactionId,
          receipt: 'some-receipt.png',
          amount: 100.0,
          users: [{ userId: recipientUser.userId, amount: 100.0 }]
        })
        .expect(201);

      console.log(response.body);

      expect(response.body.splitId).toBe(splitId);
      expect(response.body.fromUserId).toBe(testUser.userId);
      expect(Number(response.body.amount)).toBe(100.0);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].user.userId).toBe(recipientUser.userId);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .post('/v1/splits/outgoing')
        .send({
          splitId: faker.string.uuid(),
          transactionId: transaction.transactionId,
          receipt: 'some-receipt.png',
          amount: 100.0,
          users: [{ userId: recipientUser.userId, amount: 100.0 }]
        })
        .expect(401);
    });
  });

  describe('/v1/splits/outgoing/:splitId (DELETE)', () => {
    let split: Split;

    beforeEach(async () => {
      split = await Split.create({
        splitId: faker.string.uuid(),
        transactionId: transaction.transactionId,
        amount: 100.0,
        fromUserId: testUser.userId,
        status: 'Pending',
        transactionDate: transaction.date,
        transactionName: transaction.description,
        transactionLogo: merchant.logo
      });
    });

    it('should cancel the split', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/splits/outgoing/${split.splitId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const canceledSplit = (await Split.findByPk(split.splitId)) as Split;
      expect(canceledSplit.status).toBe('Canceled');
    });

    it('should cancel the split and all pending parts', async () => {
      await SplitPart.create({
        partId: faker.string.uuid(),
        splitId: split.splitId,
        userId: recipientUser.userId,
        amount: 50.0,
        status: 'Pending'
      });

      await request(app.getHttpServer())
        .delete(`/v1/splits/outgoing/${split.splitId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const updatedSplit = (await Split.findByPk(split.splitId)) as Split;
      expect(updatedSplit.status).toBe('Canceled');

      const canceledParts = await SplitPart.findAll({
        where: { splitId: split.splitId, status: 'Canceled' }
      });

      expect(canceledParts).toHaveLength(1);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer()).delete(`/v1/splits/outgoing/${split.splitId}`).expect(401);
    });
  });

  describe('/v1/splits/outgoing (GET)', () => {
    beforeEach(async () => {
      await Split.create({
        splitId: faker.string.uuid(),
        transactionId: transaction.transactionId,
        amount: 100.0,
        fromUserId: testUser.userId,
        status: 'Pending',
        transactionDate: transaction.date,
        transactionName: transaction.description,
        transactionLogo: merchant.logo
      });

      await Split.create({
        splitId: faker.string.uuid(),
        transactionId: transaction2.transactionId,
        amount: 200.0,
        fromUserId: testUser.userId,
        status: 'Pending',
        transactionDate: transaction.date,
        transactionName: transaction.description,
        transactionLogo: merchant.logo
      });
    });

    it('should return all splits for the user when no transactionId is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/splits/outgoing')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
    });

    it('should return filtered splits when transactionId is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/splits/outgoing')
        .query({ transactionId: transaction.transactionId })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('splitId');
      expect(response.body[0].fromUserId).toBe(testUser.userId);
      expect(response.body[0].amount).toBe(100.0);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .get('/v1/splits/outgoing')
        .query({ transactionId: transaction.transactionId })
        .expect(401);
    });
  });

  describe('/v1/splits/outgoing/:splitId (GET)', () => {
    let split: Split;

    beforeEach(async () => {
      split = await Split.create({
        splitId: faker.string.uuid(),
        transactionId: transaction.transactionId,
        amount: 100.0,
        fromUserId: testUser.userId,
        status: 'Pending',
        transactionDate: transaction.date,
        transactionName: transaction.description,
        transactionLogo: merchant.logo
      });
    });

    it('should return split details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/splits/outgoing/${split.splitId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.splitId).toBe(split.splitId);
      expect(response.body.fromUserId).toBe(testUser.userId);
      expect(response.body.amount).toBe(100.0);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer()).get(`/v1/splits/outgoing/${split.splitId}`).expect(401);
    });

    it('should return 404 if split is not found', async () => {
      await request(app.getHttpServer())
        .get(`/v1/splits/outgoing/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
