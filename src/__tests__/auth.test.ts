import request from 'supertest';
import server from '../app';
import prisma from '../lib/prisma';
import {closeRedisConnection, getRedisConnection} from '../lib/redis';
import {faker} from '@faker-js/faker';
import {RoleType} from '@prisma/client';

let redis: unknown;
const sessionIds: string[] = [];

beforeAll(async () => {
  redis = await getRedisConnection();
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test-',
      },
    },
  });

  if (redis && sessionIds.length > 0) {
    const keys = sessionIds.map(id => `session:${id}`);
    await redis.del(...keys);
  }

  await prisma.$disconnect();

  if (redis) {
    await closeRedisConnection();
  }

  //   server.close()
});

describe('Auth API Integration Tests', () => {
  describe('POST /api/v1/auth/signup', () => {
    it('should create a new admin successfully', async () => {
      const fakeUser = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: RoleType.ADMIN,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    it('should create a new user successfully', async () => {
      const fakeUser = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    it('should return 400 if full name is missing', async () => {
      const fakeUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if email is missing', async () => {
      const fakeUser = {
        fullName: faker.person.fullName(),
        password: faker.internet.password(),
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if password is missing', async () => {
      const fakeUser = {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 if email exists', async () => {
      const fakeUser = {
        fullName: faker.person.fullName(),
        email: 'test-retro07@gmail.com',
        password: faker.internet.password(),
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();

      const userWithDuplicateEmail = {
        fullName: faker.person.fullName(),
        email: 'test-retro07@gmail.com',
        password: faker.internet.password(),
        role: RoleType.USER,
      };

      const res = await request(server)
        .post('/api/v1/auth/signup')
        .send(userWithDuplicateEmail)
        .expect(409);

      expect(res.body.err).toBe('User with email exists!');
    });
  });

  describe('POST /api/v1/auth/signin', () => {
    let existingEmail: string;
    const password = faker.internet.password();

    beforeAll(async () => {
      existingEmail = faker.internet.email();
      const fakeUser = {
        fullName: faker.person.fullName(),
        email: existingEmail,
        password,
        role: RoleType.USER,
      };

      const response = await request(server).post('/api/v1/auth/signup').send(fakeUser).expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: existingEmail,
          password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeTruthy();
    });

    it('should return 404 if email is not found', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(404);

      expect(response.body.err).toBe('Account not found!');
    });

    it('should return 401 if password is invalid', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: existingEmail,
          password: faker.internet.password(),
        })
        .expect(401);

      expect(response.body.err).toBe('Invalid password');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          password,
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: existingEmail,
        })
        .expect(400);

      expect(response.body.err).toBe('Password is required!');
    });
  });

  describe('POST /api/v1/auth/signOut', () => {
    const testUser = {
      fullName: faker.person.fullName(),
      email: 'test-tester@example.com',
      password: 'StrongPassword123!',
      role: RoleType.USER,
    };

    let token: string;
    let sessionId: string;

    beforeAll(async () => {
      // Signup
      const signupRes = await request(server)
        .post('/api/v1/auth/signup')
        .send(testUser)
        .expect(201);

      token = signupRes.body.token;

      // Extract sessionId from token payload (if needed)
      const [, payload] = token.split('.');
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      sessionId = decoded.sessionId;
    });

    afterAll(async () => {
      const redisClient = await getRedisConnection();
      await redisClient.del(`session:${sessionId}`);
      await redisClient.quit();
    });

    it('should log out successfully and remove session from Redis', async () => {
      const redisClient = await getRedisConnection();

      // Ensure session exists before signOut
      const sessionBefore = await redisClient.get(`session:${sessionId}`);
      expect(sessionBefore).not.toBeNull();

      // Call signOut
      const res = await request(server)
        .post('/api/v1/auth/signOut')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.message).toBe('Logged out successfully');

      // Ensure session is removed
      const sessionAfter = await redisClient.get(`session:${sessionId}`);
      expect(sessionAfter).toBeNull();
    });
  });
});
