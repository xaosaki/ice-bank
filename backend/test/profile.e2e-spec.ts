import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { ProfileModule } from '../src/profile/profile.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { getFakeUser } from './utils/utils';
import { TokenModule } from '../src/common/modules/token/token.module';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, ProfileModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  beforeEach(async () => {
    testUser = await User.create(await getFakeUser());
    token = jwtService.sign({ username: testUser.email, sub: testUser.userId });
  });

  it('should return the user profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('userId', testUser.userId);
    expect(response.body).toHaveProperty('email', testUser.email);
  });
});
