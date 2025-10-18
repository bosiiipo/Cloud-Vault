import request from 'supertest';
import path from 'path';
import fs from 'fs';
import server from '../server';
import { faker } from '@faker-js/faker';
import { RoleType } from '@prisma/client';
import prisma from '../lib/prisma';
import app from '../app';

let count = 0;

let token: string;

beforeAll(async () => {
    const fakeUser = {
        fullName: faker.person.fullName(),
        email: `test-retro${count++}@gmail.com`,
        password: "Password@12345!",
        role: RoleType.ADMIN
    };

    const response = await request(server)
    .post('/api/v1/auth/signup')
    .send(fakeUser)
    .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeTruthy();

    token = response.body.token;
});


afterAll(async () => {
  await prisma.file.deleteMany({
    where: {
      user: {
        email: {
          contains: 'test-',
        },
      },
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test-',
      },
    },
  });

//   server.close();
});

describe('POST /api/v1/upload', () => {

  it('should upload a file successfully with valid token', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Hello world');

    const res = await request(server)
      .post('/api/v1/upload') 
      .set('Authorization', `Bearer ${token}`)
      .field('fileName', 'retro')
      .attach('file', testFilePath);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'File uploaded successfully!');
    expect(res.body).toHaveProperty('key');

    fs.unlinkSync(testFilePath); 
  });

  it('should return 401 if no token is provided', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Unauthorized');

    const res = await request(app)
      .post('/api/v1/upload')
      .attach('file', testFilePath);

    console.log({res});

    expect(res.status).toBe(401);
    // expect(res.body).toHaveProperty('err');
    expect(res.body).toHaveProperty('message', 'No token provided!');

    fs.unlinkSync(testFilePath);
  });

//   it('should return 400 if no file is uploaded', async () => {
//     const res = await request(server)
//       .post('/api/v1/upload')
//       .set('Authorization', `Bearer ${token}`);

//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('errors');
//   });

//   it('should return 400 if file exceeds max size', async () => {
//     const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'a'); // 6MB
//     const testFilePath = path.join(__dirname, 'fixtures', 'large.txt');
//     fs.writeFileSync(testFilePath, largeBuffer);

//     const res = await request(server)
//       .post('/api/v1/upload')
//       .set('Authorization', `Bearer ${token}`)
//       .attach('file', testFilePath);

//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('errors');

//     fs.unlinkSync(testFilePath);
//   });

//   it('should return 400 if file type is not allowed', async () => {
//     const testFilePath = path.join(__dirname, 'fixtures', 'invalid.exe');
//     fs.writeFileSync(testFilePath, 'fake exe content');

//     const res = await request(server)
//       .post('/api/v1/upload')
//       .set('Authorization', `Bearer ${token}`)
//       .attach('file', testFilePath);

//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('errors');

//     fs.unlinkSync(testFilePath);
//   });
});
