import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import usersRouter from '../user.router';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../user.model';
import { mockUser } from '../../mocks';
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

describe('POST /api/users/login - User Login', () => {
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
        jest.restoreAllMocks();
    });

    it('should login successfully with valid credentials', async () => {
        const hashedPassword = await bcrypt.hash(mockUser.password!, 10);
        await User.create({
            ...mockUser,
            password: hashedPassword
        });

        const res = await request(app)
            .post('/api/users/login')
            .send({
                username: mockUser.username,
                password: mockUser.password
            })
            .expect(StatusCodes.OK);

        expect(res.text).toBeDefined();
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toMatch(/refreshToken/);
    });

    it('should return 404 for invalid password', async () => {
        const hashedPassword = await bcrypt.hash(mockUser.password!, 10);
        await User.create({
            ...mockUser,
            password: hashedPassword
        });

        await request(app)
            .post('/api/users/login')
            .send({
                username: mockUser.username,
                password: 'wrongpassword'
            })
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it('should return 404 for non-existent user', async () => {
        await request(app)
            .post('/api/users/login')
            .send({
                username: 'nonexistent',
                password: 'somepassword'
            })
            .expect(StatusCodes.UNAUTHORIZED);
    });
});
