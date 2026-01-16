import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../user.model';
import { mockUser } from '../../mocks';

describe('PUT /api/users/:userId - Update user', () => {
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

    it('should update a user', async () => {
        const user = await User.create(mockUser);
        const res = await request(app)
            .put(`/api/users/${user._id.toString()}`)
            .send({ ...mockUser, displayName: 'Updated Name' })
            .expect(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', 'User updated successfully');
        expect(res.body.data).toHaveProperty('displayName', 'Updated Name');
    });
});

