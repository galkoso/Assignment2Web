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
    mockPostMultiple,
    mockCommentMultiple,
    mockCommentOlder,
    mockCommentNewer,
    mockCommentForPost1,
    mockCommentForPost2,
    mockInvalidPostId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('GET /api/comments/post/:postId - Get all comments for a post', () => {
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

    it('should return empty array when no comments exist for post', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count', 0);
        expect(response.body.data).toEqual([]);
    });

    it('should return all comments for a specific post', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        await Comment.insertMany(
            mockCommentMultiple.map(comment => ({
                ...comment,
                userId: user._id,
                postId: post._id
            }))
        );

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('count', 2);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
    });

    it('should return comments sorted by createdAt descending (newest first)', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        await Comment.create({
            ...mockCommentOlder,
            userId: user._id,
            postId: post._id
        });

        await Comment.create({
            ...mockCommentNewer,
            userId: user._id,
            postId: post._id
        });

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.OK);

        expect(response.body.data.length).toBe(2);
        expect(response.body.data[0].content).toBe('Newer comment');
        expect(response.body.data[1].content).toBe('Older comment');
    });

    it('should return 404 when post does not exist', async () => {
        await request(app)
            .get(`/api/comments/post/${mockInvalidPostId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should only return comments for the specified post', async () => {
        const user = await User.create(mockUser);
        const post1 = await Post.create({ ...mockPostMultiple[0], userId: user._id });
        const post2 = await Post.create({ ...mockPostMultiple[1], userId: user._id });

        await Comment.create({
            ...mockCommentForPost1,
            userId: user._id,
            postId: post1._id
        });

        await Comment.create({
            ...mockCommentForPost2,
            userId: user._id,
            postId: post2._id
        });

        const response = await request(app)
            .get(`/api/comments/post/${post1._id}`)
            .expect(StatusCodes.OK);

        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].content).toBe('Comment for post 1');
    });

    it('should return 500 when comment query fails (catch path)', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const sort = jest.fn<(arg: unknown) => Promise<unknown>>().mockRejectedValue(new Error('boom'));
        jest.spyOn(Comment, 'find').mockReturnValueOnce({
            sort,
        } as any);

        const response = await request(app)
            .get(`/api/comments/post/${post._id}`)
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);

        expect(response.body).toHaveProperty('error', 'Failed to fetch comments');
    });
});
