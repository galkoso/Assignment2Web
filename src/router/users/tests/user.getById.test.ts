import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('GET /api/users/:userId - Get user by id', () => {
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

    it('should return 404 for missing user', async () => {
        const res = await request(app).get('/api/users/507f1f77bcf86cd799439011').expect(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty('error', 'User not found');
    });
});

