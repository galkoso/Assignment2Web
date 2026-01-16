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
    mockCommentToDelete,
    mockComment1,
    mockComment2,
    mockInvalidCommentId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';

describe('DELETE /api/comments/:id - Delete a comment', () => {
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

    it('should delete a comment successfully', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment = await Comment.create({
            ...mockCommentToDelete,
            userId: user._id,
            postId: post._id
        });

        const response = await request(app)
            .delete(`/api/comments/${comment._id}`)
            .expect(StatusCodes.OK);

        expect(response.body).toHaveProperty('message', 'Comment deleted successfully');

        const deletedComment = await Comment.findById(comment._id);
        expect(deletedComment).toBeNull();
    });

    it('should return 404 when comment does not exist', async () => {
        await request(app)
            .delete(`/api/comments/${mockInvalidCommentId}`)
            .expect(StatusCodes.NOT_FOUND);
    });

    it('should only delete the specified comment', async () => {
        const user = await User.create(mockUser);
        const post = await Post.create({ ...mockPost, userId: user._id });

        const comment1 = await Comment.create({
            ...mockComment1,
            userId: user._id,
            postId: post._id
        });

        const comment2 = await Comment.create({
            ...mockComment2,
            userId: user._id,
            postId: post._id
        });

        await request(app)
            .delete(`/api/comments/${comment1._id}`)
            .expect(StatusCodes.OK);

        const deletedComment = await Comment.findById(comment1._id);
        expect(deletedComment).toBeNull();

        const remainingComment = await Comment.findById(comment2._id);
        expect(remainingComment).not.toBeNull();
        expect(remainingComment?.content).toBe('Comment 2');
    });

    it('should return 500 for invalid ID format (catch path)', async () => {
        const response = await request(app)
            .delete('/api/comments/invalid-id')
            .expect(StatusCodes.INTERNAL_SERVER_ERROR);

        expect(response.body).toHaveProperty('error', 'Failed to delete comment');
    });
});
