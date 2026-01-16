import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { mockUser } from '../../mocks';
import { User } from '../user.model';
import { jest } from '@jest/globals';

describe('POST /api/users - Create user', () => {
    let app: Express;

    beforeAll(async () => {
        await connectTestDb();
        app = express();
        app.use(express.json());
        app.use('/api/users', usersRouter);
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    beforeEach(async () => {
        await clearTestDb();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a user', async () => {
        const res = await request(app).post('/api/users').send(mockUser).expect(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('username', mockUser.username);
        expect(res.body.data).toHaveProperty('email', mockUser.email);
        expect(res.body.data).toHaveProperty('_id');
    });

    it('should return 400 when username is missing', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ email: 'a@b.com' })
            .expect(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'username and email are required');
    });

    it('should return 400 when email is missing', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ username: 'abc' })
            .expect(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'username and email are required');
    });

    it('should allow optional fields to be omitted', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ username: 'abc', email: 'abc@example.com' })
            .expect(StatusCodes.CREATED);

        expect(res.body.data.displayName).toBeUndefined();
        expect(res.body.data.bio).toBeUndefined();
    });

    it('should return 400 when create throws (catch path)', async () => {
        jest.spyOn(User, 'create').mockRejectedValueOnce(new Error('boom'));

        const res = await request(app)
            .post('/api/users')
            .send(mockUser)
            .expect(StatusCodes.BAD_REQUEST);

        expect(res.body).toHaveProperty('error', 'Failed to create user');
    });
});

