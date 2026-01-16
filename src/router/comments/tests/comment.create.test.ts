import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Post } from '../../posts/post.model';
import { User } from '../../users/user.model';
import {
    mockPost,
    mockCommentData,
    mockCommentWithoutOwner,
    mockCommentWithoutPostId,
    mockCommentWithoutContent,
    mockInvalidPostId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('POST /api/comments - Create a new comment', () => {
    let app: Express;

    beforeAll(async () => {
        await connectTestDb();
        app = express();
        app.use(express.json());
        app.use('/api/comments', commentRouter);
    });

    afterAll(async () => await disconnectTestDb());

    beforeEach(async () => await clearTestDb());

    it('should create a new comment successfully', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const commentData = {
            ...mockCommentData,
            postId: post._id.toString(),
            userId: user._id.toString()
        };

        const response = await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.CREATED);

        expect(response.body).toHaveProperty('message', 'Comment created successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('userId');
        expect(response.body.data).toHaveProperty('content', commentData.content);
        expect(response.body.data).toHaveProperty('postId');
        expect(response.body.data).toHaveProperty('_id');
    });

    it('should fail when userId is missing', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const commentData = {
            ...mockCommentWithoutOwner,
            postId: post._id.toString()
        };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when postId is missing', async () => {
        const commentData = mockCommentWithoutPostId;

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when content is missing', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const commentData = {
            ...mockCommentWithoutContent,
            postId: post._id.toString(),
            userId: user._id.toString()
        };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when post does not exist', async () => {
        const user = await User.create(mockUser);
        const commentData = { ...mockCommentData, postId: mockInvalidPostId, userId: user._id.toString() };

        await request(app)
            .post('/api/comments')
            .send(commentData)
            .expect(StatusCodes.NOT_FOUND);
    });
});
