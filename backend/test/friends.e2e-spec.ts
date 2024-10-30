import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDatabaseModule } from './utils/test-database.module';
import { FriendsModule } from '../src/friends/friends.module';
import { User } from '../src/common/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { getFakeUser } from './utils/utils';
import { TokenModule } from '../src/common/modules/token/token.module';

describe('FriendsController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let testUser: User;
  let friendUser: User;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestDatabaseModule, TokenModule, FriendsModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  beforeEach(async () => {
    testUser = await User.create(await getFakeUser());
    friendUser = await User.create(await getFakeUser());
    token = jwtService.sign({ username: testUser.email, sub: testUser.userId });
  });

  it('should add a friend', async () => {
    await request(app.getHttpServer())
      .post(`/v1/friends/${friendUser.userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const friends = await request(app.getHttpServer())
      .get('/v1/friends')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(friends.body).toHaveLength(1);
    expect(friends.body[0].userId).toBe(friendUser.userId);
  });

  it('should remove a friend', async () => {
    await request(app.getHttpServer())
      .post(`/v1/friends/${friendUser.userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/v1/friends/${friendUser.userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const friends = await request(app.getHttpServer())
      .get('/v1/friends')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(friends.body).toHaveLength(0);
  });
});
