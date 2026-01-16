import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../user.model';
import { mockUser } from '../../mocks';

describe('DELETE /api/users/:userId - Delete user', () => {
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

    it('should delete a user', async () => {
        const user = await User.create(mockUser);
        await request(app).delete(`/api/users/${user._id.toString()}`).expect(StatusCodes.NO_CONTENT);
        const remaining = await User.countDocuments();
        expect(remaining).toBe(0);
    });
});

