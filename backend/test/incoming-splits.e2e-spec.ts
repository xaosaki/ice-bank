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

describe('IncomingSplitsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let fromUser: User;
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

    split = await Split.create({
      splitId: faker.string.uuid(),
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
    it('should accept the split', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept' })
        .expect(200);

      const updatedPart = await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      });
      expect(updatedPart!.status).toBe('Accepted');
    });

    it('should decline the split', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'decline' })
        .expect(200);

      const updatedPart = await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      });
      expect(updatedPart!.status).toBe('Declined');
    });

    it('should mark the split as Completed when all parts are processed', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept' })
        .expect(200);

      const updatedSplit = (await Split.findByPk(split.splitId)) as Split;
      expect(updatedSplit.status).toBe('Completed');
    });

    it('should not allow processing a part that is already accepted or declined', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept' })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept' })
        .expect(400);
    });

    it('should allow adding a comment when accepting a split part', async () => {
      const comment = 'Thanks for the dinner!';

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${token}`)
        .send({ action: 'accept', comment })
        .expect(200);

      const updatedPart = (await SplitPart.findOne({
        where: { splitId: split.splitId, userId: testUser.userId }
      })) as SplitPart;
      expect(updatedPart.status).toBe('Accepted');
      expect(updatedPart.comment).toBe(comment);
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .send({ action: 'accept' })
        .expect(401);
    });

    it('should return 403 if user is not part of the split', async () => {
      const anotherUser = await User.create(await getFakeUser());
      const anotherToken = jwtService.sign({
        username: anotherUser.email,
        sub: anotherUser.userId
      });

      await request(app.getHttpServer())
        .post(`/v1/splits/incoming/${split.splitId}/process`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ action: 'accept' })
        .expect(403);
    });
  });
});
