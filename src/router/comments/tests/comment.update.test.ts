import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import commentRouter from '../comment.router';
import { Comment } from '../comment.model';
import { Post } from '../../posts/post.model';
import { User } from '../../users/user.model';
import {
    mockPost,
    mockCommentOriginal,
    mockCommentUpdated,
    mockCommentUpdatedWithSpaces,
    mockUpdateCommentWithoutContent,
    mockInvalidCommentId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('PUT /api/comments/:id - Update a comment', () => {
    let app: Express;

    beforeAll(async () => {
        await connectTestDb();
        app = express();
        app.use(express.json());
        app.use('/api/comments', commentRouter);
    });

    afterAll(async () => await disconnectTestDb());

    beforeEach(async () => await clearTestDb());

    it('should update a comment successfully', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment = await Comment.create({
            ...mockCommentOriginal,
            userId: user._id,
            postId: post._id
        });

        const updateData = mockCommentUpdated;

        const response = await request(app)
            .put(`/api/comments/${comment._id}`)
            .send(updateData)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('message', 'Comment updated successfully');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('content', 'Updated content');
        expect(response.body.data).toHaveProperty('_id', comment._id.toString());
    });

    it('should fail when content is missing', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment = await Comment.create({
            ...mockCommentOriginal,
            userId: user._id,
            postId: post._id
        });

        await request(app)
            .put(`/api/comments/${comment._id}`)
            .send(mockUpdateCommentWithoutContent)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .put(`/api/comments/${mockInvalidCommentId}`)
            .send(mockCommentUpdated)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should trim content when updating', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment = await Comment.create({
            ...mockCommentOriginal,
            userId: user._id,
            postId: post._id
        });

        const updateData = mockCommentUpdatedWithSpaces;

        const response = await request(app)
            .put(`/api/comments/${comment._id}`)
            .send(updateData)
            .expect(StatusCodes.OK);

        expect(response.body.data.content).toBe('Updated content with spaces');
    });
});
