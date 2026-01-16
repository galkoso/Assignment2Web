import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { mockUser } from '../../mocks';

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

    it('should create a user', async () => {
        const res = await request(app).post('/api/users').send(mockUser).expect(StatusCodes.CREATED);
        expect(res.body).toHaveProperty('message', 'User created successfully');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('username', mockUser.username);
        expect(res.body.data).toHaveProperty('email', mockUser.email);
        expect(res.body.data).toHaveProperty('_id');
    });
});

