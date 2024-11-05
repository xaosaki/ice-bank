import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { IncomingSplitsModule } from '../src/incoming-splits/incoming-splits.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { getFakeUser } from './utils/utils';
import { Split } from '../src/common/models/split.model';
import { SplitPart } from '../src/common/models/split-part.model';
import { TokenModule } from '../src/common/modules/token/token.module';
import { Account } from '../src/common/models/account.model';

describe('IncomingSplitsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let fromUser: User;
  let fromAccount: Account;
  let split: Split;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, IncomingSplitsModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await SplitPart.destroy({ where: {}, force: true, truncate: true });
    await Split.destroy({ where: {}, force: true, truncate: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await app.close();
  });

  beforeEach(async () => {
    testUser = await User.create(await getFakeUser());
    fromUser = await User.create(await getFakeUser());
    token = jwtService.sign({ username: testUser.email, sub: testUser.userId });

    fromAccount = await Account.create({
      accountId: faker.string.uuid(),
      userId: fromUser.userId,
      balance: 100.0,
      currency: 'CAD'
    });

    split = await Split.create({
      splitId: faker.string.uuid(),
      accountId: fromAccount.accountId,
      transactionId: faker.string.uuid(),
      transactionName: 'Dinner',
      transactionLogo: '/receipts/dinner.png',
      transactionDate: new Date(),
      amount: 100.0,
      receipt: '/receipts/split123.png',
      fromUserId: fromUser.userId,
      status: 'Pending'
    });

    await SplitPart.create({
      partId: faker.string.uuid(),
      splitId: split.splitId,
      userId: testUser.userId,
      amount: 50.0,
      status: 'Pending'
    });
  });

  describe('/v1/splits/incoming (GET)', () => {
    it('should return a list of incoming splits', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/splits/incoming')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('splitId', split.splitId);
      expect(response.body[0].fromUser.userId).toBe(fromUser.userId);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer()).get('/v1/splits/incoming').expect(401);
    });
  });

  describe('/v1/splits/incoming/:splitId (GET)', () => {
    it('should return split details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/v1/splits/incoming/${split.splitId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.splitId).toBe(split.splitId);
      expect(response.body.amountForPay).toBe(50.0);
      expect(response.body.fromUser.userId).toBe(fromUser.userId);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer()).get(`/v1/splits/incoming/${split.splitId}`).expect(401);
    });

    it('should return 404 if split is not found', async () => {
      await request(app.getHttpServer())
        .get(`/v1/splits/incoming/${faker.string.uuid()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/v1/splits/incoming/:splitId/process (POST)', () => {
    let userAccount: Account;

    beforeEach(async () => {
      userAccount = await Account.create({
        accountId: faker.string.uuid(),
        userId: testUser.userId,
        balance: 100.0,
        currency: 'CAD'
      });
    });

    it('should accept the split and deduct from the user account', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId })
        .expect(200);

      const updatedPart = await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      });
      const updatedFromAccount = await Account.findByPk(fromAccount.accountId);
      const updatedUserAccount = await Account.findByPk(userAccount.accountId);

      expect(updatedPart!.status).toBe('Accepted');
      expect(Number(updatedFromAccount!.balance)).toBe(150.0);
      expect(Number(updatedUserAccount!.balance)).toBe(50.0);
    });

    it('should decline the split without modifying account balance', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'decline', accountId: userAccount.accountId })
        .expect(200);

      const updatedPart = await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      });
      const updatedAccount = await Account.findByPk(userAccount.accountId);

      expect(updatedPart!.status).toBe('Declined');
      expect(Number(updatedAccount!.balance)).toBe(100.0);
    });

    it('should mark the split as Completed when all parts are processed', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId })
        .expect(200);

      const updatedSplit = await Split.findByPk(split.splitId);
      expect(updatedSplit!.status).toBe('Completed');
    });

    it('should not allow processing a part that is already accepted or declined', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId })
        .expect(400);
    });

    it('should allow adding a comment when accepting a split part', async () => {
      const comment = 'Thanks for the dinner!';

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId, comment })
        .expect(200);

      const updatedPart = await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      });
      expect(updatedPart!.status).toBe('Accepted');
      expect(updatedPart!.comment).toBe(comment);
    });

    it('should return 403 if accountId does not belong to the user', async () => {
      const anotherAccount = await Account.create({
        accountId: faker.string.uuid(),
        userId: fromUser.userId,
        balance: 100.0,
        currency: 'CAD'
      });

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: anotherAccount.accountId })
        .expect(403);
    });

    it('should return 400 if user account has insufficient balance', async () => {
      await userAccount.update({ balance: 20.0 }); // Set balance below required amount

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', accountId: userAccount.accountId })
        .expect(400);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .send({ action: 'accept' })
        .expect(401);
    });
  });
});
