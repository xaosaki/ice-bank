import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { TestDatabaseModule } from './utils/test-database.module';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { BlacklistToken } from '../src/common/models/blacklist-token.model';
import { TokenModule } from '../src/common/modules/token/token.module';
import { getFakeUser } from './utils/utils';
import { Account } from '../src/common/models/account.model';

describe('AuthEndpoints (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, AuthModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await User.destroy({ where: {}, truncate: true });
    await app.close();
  });

  describe('/v1/auth/register (POST)', () => {
    it('should register a new user and create an account', async () => {
      const fakeUser = await getFakeUser();
      const response = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send(fakeUser)
        .expect(201);

      const { password, passwordHash, ...expectedUser } = fakeUser;
      expect(response.body).toEqual(expectedUser);

      const user = await User.findOne({ where: { email: fakeUser.email } });
      expect(user).not.toBeNull();

      const account = await Account.findOne({ where: { userId: user!.userId } });
      expect(account).not.toBeNull();
      expect(Number(account!.balance)).toBe(1000);
      expect(account!.currency).toBe('CAD');
    });

    it('should not allow duplicate registration', async () => {
      const fakeUser = await getFakeUser();
      await request(app.getHttpServer()).post('/v1/auth/register').send(fakeUser).expect(201);
      await request(app.getHttpServer()).post('/v1/auth/register').send(fakeUser).expect(400);
    });
  });

  describe('/v1/auth/login (POST)', () => {
    let password: any, user: any;

    beforeAll(async () => {
      const fakeUser = await getFakeUser();
      password = fakeUser.password;
      user = fakeUser;
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ ...user, passwordHash });
    });

    it('should log in the user with correct credentials', async () => {
      const email = user.email;
      const response = await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email, password })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.userId).toEqual(user.userId);
    });

    it('should reject login with incorrect credentials', async () => {
      const email = user.email;
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email, password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('/v1/auth/logout (POST)', () => {
    it('should log out the user and blacklist the token', async () => {
      const { password, ...user } = await getFakeUser();
      const passwordHash = await bcrypt.hash(password, 10);
      const testToken = jwtService.sign({ username: user.email, sub: user.userId });
      await User.create({ ...user, passwordHash });

      await request(app.getHttpServer())
        .post('/v1/auth/logout')
        .set('Authorization', `Bearer ${testToken}`)
        .expect(200);

      const blacklistEntry = await BlacklistToken.findOne({
        where: { token: testToken }
      });

      expect(blacklistEntry).not.toBeNull();
      expect(blacklistEntry?.token).toBe(testToken);
    });

    it('should return 401 if Authorization header is missing', async () => {
      await request(app.getHttpServer()).post('/v1/auth/logout').expect(401);
    });
  });
});
