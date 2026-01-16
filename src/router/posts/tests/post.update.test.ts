import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import { Post } from '../post.model';
import {
    mockPostOriginal,
    mockPostUpdated,
    mockPostUpdatedPartial,
    mockPostUpdatedTitleOnly,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../../users/user.model';

describe('PUT /api/posts/:postId - Update a post', () => {
  let app: Express;

  beforeAll(async () => {
    await connectTestDb();
    app = express();
    app.use(express.json());
    app.use('/api/posts', postRouter);
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it('should update a post successfully with all fields', async () => {
    const user = await User.create(mockUser);
    const createdPost = await Post.create({ ...mockPostOriginal, userId: user._id });

    const updateData = { ...mockPostUpdated, userId: user._id.toString() };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('message', 'Post updated successfully');
    expect(response.body).toHaveProperty('updatedPost');
    expect(response.body.updatedPost).toHaveProperty('title', updateData.title);
    expect(response.body.updatedPost).toHaveProperty('content', updateData.content);
    expect(response.body.updatedPost).toHaveProperty('userId');
    expect(response.body.updatedPost._id.toString()).toBe(createdPost._id.toString());
  });

  it('should return 404 when post ID does not exist', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const user = await User.create(mockUser);
    const updateData = { ...mockPostUpdated, userId: user._id.toString() };

    const response = await request(app)
      .put(`/api/posts/${fakeId.toString()}`)
      .send(updateData)
      .expect(StatusCodes.NOT_FOUND);

    expect(response.body).toHaveProperty('error', 'Post not found');
  });

  it('should update only provided fields', async () => {
    const user = await User.create(mockUser);
    const createdPost = await Post.create({ ...mockPostOriginal, userId: user._id });

    const updateData = { ...mockPostUpdatedPartial, userId: user._id.toString() };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(StatusCodes.OK);

    expect(response.body.updatedPost.title).toBe('Updated Title');
    expect(response.body.updatedPost.content).toBe('Updated content');
    expect(response.body.updatedPost.userId).toBe(user._id.toString());
  });

  it('should return 500 when invalid ID format is provided', async () => {
    const user = await User.create(mockUser);
    const updateData = {
      title: 'Updated Title',
      content: 'Updated content',
      userId: user._id.toString(),
      publishDate: new Date('2024-01-20')
    };

    const response = await request(app)
      .put('/api/posts/invalid-id')
      .send(updateData)
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toHaveProperty('error', 'Failed to update post');
  });

  it('should fail when required fields are missing', async () => {
    const user = await User.create(mockUser);
    const createdPost = await Post.create({ ...mockPostOriginal, userId: user._id });

    const updateData = mockPostUpdatedTitleOnly;

    await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it('should maintain post ID after update', async () => {
    const user = await User.create(mockUser);
    const createdPost = await Post.create({ ...mockPostOriginal, userId: user._id });

    const originalId = createdPost._id.toString();

    const updateData = { ...mockPostUpdated, userId: user._id.toString() };

    const response = await request(app)
      .put(`/api/posts/${createdPost._id.toString()}`)
      .send(updateData)
      .expect(StatusCodes.OK);

    expect(response.body.updatedPost._id.toString()).toBe(originalId);
  });
});
