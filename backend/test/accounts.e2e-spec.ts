import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { AccountsModule } from '../src/accounts/accounts.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { Account } from '../src/common/models/account.model';
import { TokenModule } from '../src/common/modules/token/token.module';
import { getFakeUser } from './utils/utils';

describe('AccountsEndpoints (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, AccountsModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await Account.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });
    await app.close();
  });

  beforeEach(async () => {
    const userData = await getFakeUser();

    testUser = await User.create(userData);
  });

  describe('/v1/accounts (GET)', () => {
    let token: string;

    beforeEach(async () => {
      token = jwtService.sign({ username: testUser.email, sub: testUser.userId });

      await Account.bulkCreate([
        {
          accountId: faker.string.uuid(),
          userId: testUser.userId,
          balance: 100.0,
          currency: 'CAD'
        },
        {
          accountId: faker.string.uuid(),
          userId: testUser.userId,
          balance: 200.5,
          currency: 'USD'
        }
      ]);
    });

    it('should return all accounts for the authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/accounts')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('accountId');
      expect(response.body[0]).toHaveProperty('balance');
      expect(response.body[0]).toHaveProperty('currency');
    });

    it('should return 401 if token is missing', async () => {
      await request(app.getHttpServer()).get('/v1/accounts').expect(401);
    });

    it('should return empty list if user has no accounts', async () => {
      const newUser = await User.create(await getFakeUser());
      const newToken = jwtService.sign({ username: newUser.email, sub: newUser.userId });

      const response = await request(app.getHttpServer())
        .get('/v1/accounts')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });
});
