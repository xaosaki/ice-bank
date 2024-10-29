import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { AccountsModule } from '../src/accounts/accounts.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { Account } from '../src/common/models/account.model';
import { Transaction } from '../src/common/models/transaction.model';
import { Merchant } from '../src/common/models/merchant.model';
import { TokenModule } from '../src/common/modules/token/token.module';
import { getFakeUser } from './utils/utils';

describe('AccountTransactionsEndpoint (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let testAccount: Account;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, AccountsModule]
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

  describe('/v1/accounts/:accountId/transactions (GET)', () => {
    let merchant: Merchant;

    beforeEach(async () => {
      merchant = await Merchant.create({
        merchantId: faker.string.uuid(),
        name: 'Amazon',
        logo: 'https://logo.com/amazon.png'
      });

      await Transaction.bulkCreate([
        {
          transactionId: faker.string.uuid(),
          accountId: testAccount.accountId,
          userId: testUser.userId,
          amount: 100.0,
          description: 'Subscription payment',
          date: new Date(),
          category: 'Subscription',
          merchantId: merchant.merchantId
        },
        {
          transactionId: faker.string.uuid(),
          accountId: testAccount.accountId,
          userId: testUser.userId,
          amount: 50.0,
          description: 'Grocery shopping',
          date: new Date(),
          category: 'Groceries',
          merchantId: merchant.merchantId
        }
      ]);
    });

    it('should return all transactions for the account', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/accounts/${testAccount.accountId}/transactions`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('transactionId');
      expect(response.body[0]).toHaveProperty('amount');
      expect(response.body[0].merchant).toEqual({
        name: 'Amazon',
        logo: 'https://logo.com/amazon.png'
      });
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .get(`/v1/accounts/${testAccount.accountId}/transactions`)
        .expect(401);
    });

    it('should return 404 if the account does not belong to the user', async () => {
      const anotherUser = await User.create(await getFakeUser());
      const anotherAccount = await Account.create({
        accountId: faker.string.uuid(),
        userId: anotherUser.userId,
        balance: 300.0,
        currency: 'USD'
      });

      const anotherToken = jwtService.sign({ username: testUser.email, sub: testUser.userId });

      await request(app.getHttpServer())
        .get(`/v1/accounts/${anotherAccount.accountId}/transactions`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(404);
    });

    it('should return an empty list if the account has no transactions', async () => {
      const newAccount = await Account.create({
        accountId: faker.string.uuid(),
        userId: testUser.userId,
        balance: 0.0,
        currency: 'CAD'
      });

      const response = await request(app.getHttpServer())
        .get(`/v1/accounts/${newAccount.accountId}/transactions`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
