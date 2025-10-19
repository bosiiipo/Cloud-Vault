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
let adminToken: string;

beforeAll(async () => {
  const fakeUser = {
    fullName: faker.person.fullName(),
    email: `test-${Date.now()}-${Math.random()}@gmail.com`,
    password: 'Password@12345!',
    role: RoleType.USER,
  };

  const response = await request(app).post('/api/v1/auth/signup').send(fakeUser).expect(201);

  expect(response.body).toHaveProperty('token');
  expect(response.body.token).toBeTruthy();

  token = response.body.token;

  const fakeAdmin = {
    fullName: faker.person.fullName(),
    email: `test-${Date.now()}-${Math.random()}@gmail.com`,
    password: 'Password@12345!',
    role: RoleType.ADMIN,
  };

  const res = await request(app).post('/api/v1/auth/signup').send(fakeAdmin).expect(201);

  expect(res.body).toHaveProperty('token');
  expect(res.body.token).toBeTruthy();

  adminToken = res.body.token;
});

afterAll(async () => {
  try {
    await prisma.file.deleteMany({
      where: { user: { email: { contains: "test-" } } }
    });

    await prisma.user.deleteMany({
      where: { email: { contains: "test-" } }
    });

    await prisma.$disconnect();
    await closeRedisConnection();
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
});


describe('Upload file', () => {
  it('should upload a file successfully', async () => {
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
});

describe('Download File', () => {
  // it('should generate a download URL for an existing file', async () => {
  //   const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
  //   fs.writeFileSync(testFilePath, 'Hello world');

  //   const res = await request(app)
  //     .post('/api/v1/upload')
  //     .set('Authorization', `Bearer ${token}`)
  //     .field('fileName', 'retro')
  //     .attach('file', testFilePath);

  //   expect(res.status).toBe(201);
  //   expect(res.body).toHaveProperty('key');
    
  //   console.log('Uploaded file key:', res.body.key); // Debug

  //   fs.unlinkSync(testFilePath);

  //   const response = await request(app)
  //     .get(`/api/v1/download?key=${res.body.key}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   console.log('Download response status:', response.status); // Debug
  //   console.log('Download response body:', response.body); // Debug

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty('url');
  //   expect(typeof response.body.url).toBe('string');
  // });

  it('should return 404 for non-existent file', async () => {
    const res = await request(app)
      .get(`/api/v1/download?key=non-existent-id`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('Flag File', () => {
  it('should flag a file successfully', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Hello world');

    const response = await request(app)
      .post('/api/v1/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('fileName', 'retro')
      .attach('file', testFilePath);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully!');
    expect(response.body).toHaveProperty('key');
    expect(response.body).toHaveProperty('fileId');

    fs.unlinkSync(testFilePath);

    const res = await request(app)
      .post(`/api/v1/file/${response.body.fileId}/flag`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Inappropriate content' });

    expect(res.status).toBe(200);
    // expect(res.body.isFlagged).toBe(true);
  });

  it('should return 404 if file not found', async () => {
    const res = await request(app)
      .post(`/api/v1/file/somewhere/flag`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'test' });

    expect(res.status).toBe(404);
  });
});

describe('Unflag File', () => {
  it('should unflag a file', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Hello world');

    const response = await request(app)
      .post('/api/v1/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('fileName', 'retro')
      .attach('file', testFilePath);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully!');
    expect(response.body).toHaveProperty('key');

    fs.unlinkSync(testFilePath);

    const res = await request(app)
      .post(`/api/v1/file/${response.body.fileId}/unflag`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Valid!' }); 

    expect(res.status).toBe(200);
    expect(res.body.isFlagged).toBe(false);
  });
});

describe('Flag File as Unsafe', () => {
  it('should mark file as unsafe', async () => {
    const testFilePath = path.join(__dirname, 'fixtures', 'test.txt');
    fs.writeFileSync(testFilePath, 'Hello world');

    const response = await request(app)
      .post('/api/v1/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('fileName', 'retro')
      .attach('file', testFilePath);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully!');
    expect(response.body).toHaveProperty('key');

    fs.unlinkSync(testFilePath);

    const res = await request(app)
      .post(`/api/v1/file/${response.body.fileId}/unsafe`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Bad content' }); 

    expect(res.body.file.status).toBe('UNSAFE');
  });

  // it('should return 404 for non-existent file', async () => {
  //   const res = await request(app)
  //     .post(`/api/v1/file/non-existent-id/flag-unsafe`)
  //     .set('Authorization', token);

  //   expect(res.status).toBe(404);
  // });
});



