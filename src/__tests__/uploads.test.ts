import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../app';
import {faker} from '@faker-js/faker';
import {RoleType} from '@prisma/client';
import prisma from '../lib/prisma';
import { closeRedisConnection } from '../lib/redis';

let count = 0;

let token: string;

beforeAll(async () => {
  const fakeUser = {
    fullName: faker.person.fullName(),
    email: `test-retro${count++}@gmail.com`,
    password: 'Password@12345!',
    role: RoleType.ADMIN,
  };

  const response = await request(app).post('/api/v1/auth/signup').send(fakeUser).expect(201);

  expect(response.body).toHaveProperty('token');
  expect(response.body.token).toBeTruthy();

  token = response.body.token;
});

afterAll(async () => {
  await prisma.file.deleteMany({ where: { user: { email: { contains: "test-" }}}});
  await prisma.user.deleteMany({ where: { email: { contains: "test-" }}});

  await prisma.$disconnect();  

  await closeRedisConnection(); 
});

describe('POST /api/v1/upload', () => {
  it('should upload a file successfully with valid token', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Hello world');

    const res = await request(app)
      .post('/api/v1/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('fileName', 'retro')
      .attach('file', testFilePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'File uploaded successfully!');
    expect(res.body).toHaveProperty('key');

    fs.unlinkSync(testFilePath);
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/v1/upload')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  // it('should return 400 if file exceeds max size (simulating 5MB limit)', async () => {
  //   const largeString = "a".repeat(6 * 1024 * 1024); // 6MB
  //   const testFilePath = path.join(__dirname, 'fixtures', 'large.txt');

  //   fs.mkdirSync(path.dirname(testFilePath), { recursive: true });

  //   // Write the test file
  //   await fs.promises.writeFile(testFilePath, largeString, 'utf8');

  //   // Send request
  //   const res = await request(app)
  //     .post('/api/v1/upload')
  //     .set('Authorization', `Bearer ${token}`)
  //     .field('fileName', 'runtown')
  //     .attach('file', testFilePath)

  //   expect(res.status).toBe(400);
  //   // expect(res.body).toHaveProperty('errors'); // or whatever your error format is

  //   fs.unlinkSync(testFilePath);
  // });
});


