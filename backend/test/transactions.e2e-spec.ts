import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { TransactionsModule } from '../src/transactions/transactions.module';
import { TokenModule } from '../src/common/modules/token/token.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { getFakeUser } from './utils/utils';
import { faker } from '@faker-js/faker';
import { Account } from '../src/common/models/account.model';
import { Transaction } from '../src/common/models/transaction.model';
import { Merchant } from '../src/common/models/merchant.model';
import { SequelizeModule } from '@nestjs/sequelize';

describe('TransactionsEndpoint (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let testAccount: Account;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TokenModule,
        SequelizeModule.forFeature([User]),
        TransactionsModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await Transaction.destroy({ where: {}, truncate: true });
    await Account.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await Merchant.destroy({ where: {}, truncate: true });
    await app.close();
  });

  beforeEach(async () => {
    const userData = await getFakeUser();
    testUser = await User.create(userData);
    testAccount = await Account.create({
      accountId: faker.string.uuid(),
      userId: testUser.userId,
      balance: 500.0,
      currency: 'CAD'
    });
    token = jwtService.sign({ username: testUser.email, sub: testUser.userId });
  });

  describe('/v1/transactions (POST)', () => {
    it('should create a new transaction', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          transactionId: faker.string.uuid(),
          accountId: testAccount.accountId,
          amount: 100.0,
          description: 'Test transaction',
          category: 'Testing',
          merchant: {
            name: 'Test Merchant',
            logo: 'https://logo.com/test.png',
            mcc: '1234'
          },
          note: 'Test note'
        })
        .expect(201);

      expect(response.body).toHaveProperty('transactionId');
      expect(response.body.amount).toBe(100.0);
      expect(response.body.merchant.name).toBe('Test Merchant');
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .post('/v1/transactions')
        .send({
          accountId: testAccount.accountId,
          amount: 100.0,
          description: 'Test transaction',
          category: 'Testing'
        })
        .expect(401);
    });
  });

  describe('/v1/transactions/:transactionId (GET)', () => {
    let transaction: Transaction;

    beforeEach(async () => {
      const merchant = await Merchant.create({
        merchantId: faker.string.uuid(),
        name: 'Amazon',
        logo: 'https://logo.com/amazon.png'
      });

      transaction = await Transaction.create({
        transactionId: faker.string.uuid(),
        accountId: testAccount.accountId,
        userId: testUser.userId,
        amount: 100.0,
        description: 'Test transaction',
        date: new Date(),
        category: 'Testing',
        merchantId: merchant.merchantId,
        note: 'Test note'
      });
    });

    it('should return the transaction by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/transactions/${transaction.transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.transactionId).toBe(transaction.transactionId);
      expect(response.body.amount).toBe(100.0);
      expect(response.body.merchant.name).toBe('Amazon');
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .get(`/v1/transactions/${transaction.transactionId}`)
        .expect(401);
    });

    it('should return 404 if the transaction does not belong to the user', async () => {
      const anotherUser = await User.create(await getFakeUser());
      const anotherToken = jwtService.sign({
        username: anotherUser.email,
        sub: anotherUser.userId
      });

      await request(app.getHttpServer())
        .get(`/v1/transactions/${transaction.transactionId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);
    });
  });
});
