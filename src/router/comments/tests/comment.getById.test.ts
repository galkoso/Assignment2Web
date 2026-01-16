import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { jest } from '@jest/globals';
import { Post } from '../../posts/post.model';
import { User } from '../../users/user.model';
import {
    mockPost,
    mockComment,
    mockInvalidCommentId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('GET /api/comments/:id - Get a comment by ID', () => {
    let app: Express;

    beforeAll(async () => {
        await connectTestDb();
        app = express();
        app.use(express.json());
        app.use('/api/comments', commentRouter);
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

    it('should return a comment by ID', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment = await Comment.create({
            ...mockComment,
            userId: user._id,
            postId: post._id,
            content: 'Test comment content'
        });

        const response = await request(app)
            .get(`/api/comments/${comment._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('_id', comment._id.toString());
        expect(response.body.data).toHaveProperty('userId', user._id.toString());
        expect(response.body.data).toHaveProperty('content', 'Test comment content');
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .get(`/api/comments/${mockInvalidCommentId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should return 404 for invalid ID format', async () => {
        const response = await request(app)
            .get('/api/comments/invalid-id')
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);

        expect(response.body).toHaveProperty('error', 'Failed to fetch comment');
    });
});
