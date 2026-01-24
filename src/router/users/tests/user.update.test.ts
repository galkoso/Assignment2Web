import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb, getAuthToken } from '../../../tests/testDb';
import { User } from '../user.model';
import { mockUser } from '../../mocks';
import { jest } from '@jest/globals';

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

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should update a user', async () => {
        const user = await User.create(mockUser);
        const res = await request(app)
            .put(`/api/users/${user._id.toString()}`)
            .set('Authorization', getAuthToken())
            .send({ ...mockUser, displayName: 'Updated Name' })
            .expect(StatusCodes.OK);
        expect(res.body).toHaveProperty('message', 'User updated successfully');
        expect(res.body.data).toHaveProperty('displayName', 'Updated Name');
    });

    it('should return 400 when username/email is missing', async () => {
        const user = await User.create(mockUser);
        const res = await request(app)
            .put(`/api/users/${user._id.toString()}`)
            .set('Authorization', getAuthToken())
            .send({ email: 'x@y.com' })
            .expect(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'username and email are required');
    });

    it('should return 400 when email is missing', async () => {
        const user = await User.create(mockUser);
        const res = await request(app)
            .put(`/api/users/${user._id.toString()}`)
            .set('Authorization', getAuthToken())
            .send({ username: 'abc' })
            .expect(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'username and email are required');
    });

    it('should return 404 when user does not exist', async () => {
        const res = await request(app)
            .put('/api/users/507f1f77bcf86cd799439011')
            .set('Authorization', getAuthToken())
            .send({ username: 'abc', email: 'abc@example.com' })
            .expect(StatusCodes.NOT_FOUND);

        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should allow optional fields to be omitted (keeps existing values)', async () => {
        const user = await User.create(mockUser);
        const res = await request(app)
            .put(`/api/users/${user._id.toString()}`)
            .set('Authorization', getAuthToken())
            .send({ username: 'abc', email: 'abc@example.com' })
            .expect(StatusCodes.OK);

        expect(res.body).toHaveProperty('message', 'User updated successfully');
        expect(res.body.data.displayName).toBe(mockUser.displayName);
        expect(res.body.data.bio).toBe(mockUser.bio);
    });

    it('should return 400 when update throws (catch path)', async () => {
        const res = await request(app)
            .put('/api/users/invalid-id')
            .set('Authorization', getAuthToken())
            .send({ username: 'u', email: 'e@e.com' })
            .expect(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('error', 'Failed to update user');
    });
});

