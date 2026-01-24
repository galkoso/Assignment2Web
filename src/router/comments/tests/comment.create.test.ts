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
    mockCommentData,
    mockCommentWithoutOwner,
    mockCommentWithoutPostId,
    mockCommentWithoutContent,
    mockInvalidPostId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb, getAuthToken } from '../../../tests/testDb';

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

    afterEach(() => {
        jest.restoreAllMocks();
    });

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
            .set('Authorization', getAuthToken())
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
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when postId is missing', async () => {
        const commentData = mockCommentWithoutPostId;

        await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
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
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should fail when post does not exist', async () => {
        const user = await User.create(mockUser);
        const commentData = { ...mockCommentData, postId: mockInvalidPostId, userId: user._id.toString() };

        await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should fail when userId is invalid', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const commentData = { ...mockCommentData, postId: post._id.toString(), userId: 'invalid-user-id' };

        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);

        expect(res.body).toHaveProperty('error', 'Invalid userId');
    });

    it('should fail when postId is invalid', async () => {
        const user = await User.create(mockUser);

        const commentData = { ...mockCommentData, postId: 'invalid-post-id', userId: user._id.toString() };

        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.BAD_REQUEST);

        expect(res.body).toHaveProperty('error', 'Invalid postId');
    });

    it('should fail when user does not exist', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const commentData = { ...mockCommentData, postId: post._id.toString(), userId: '507f1f77bcf86cd799439011' };

        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.NOT_FOUND);

        expect(res.body).toHaveProperty('error', 'User not found');
    });

    it('should return 500 when Comment.create throws (catch path)', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        jest.spyOn(Comment, 'create').mockRejectedValueOnce(new Error('boom'));

        const commentData = { ...mockCommentData, postId: post._id.toString(), userId: user._id.toString() };

        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', getAuthToken())
            .send(commentData)
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);

        expect(res.body).toHaveProperty('error', 'Failed to create comment');
    });
});
