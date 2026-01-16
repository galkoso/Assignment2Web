import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../user.model';
import { mockUser } from '../../mocks';

describe('GET /api/users - getAllUsers', () => {
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

    it('should return all users', async () => {
        await User.create(mockUser);
        const res = await request(app).get('/api/users').expect(StatusCodes.OK);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
    });
});

