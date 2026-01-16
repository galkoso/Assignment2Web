import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import { Post } from '../post.model';
import { jest } from '@jest/globals';
import {
    mockPostMultiple,
    mockPostOlder,
    mockPostNewer,
    mockPost,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../../users/user.model';

describe('GET /api/posts - Get all posts', () => {
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty array when no posts exist', async () => {
    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return all posts as JSON array', async () => {
    const user = await User.create(mockUser);
    await Post.insertMany(mockPostMultiple.map((p) => ({ ...p, userId: user._id })));

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
  });

  it('should return posts sorted by publishDate descending (newest first)', async () => {
    const user = await User.create(mockUser);
    await Post.insertMany([{ ...mockPostOlder, userId: user._id }, { ...mockPostNewer, userId: user._id }]);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post');
    expect(response.body.data[1].title).toBe('Older Post');
  });

  it('should return posts with all required fields', async () => {
    const user = await User.create(mockUser);
    await Post.insertMany([{ ...mockPost, userId: user._id }]);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    const post = response.body.data[0];
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post).toHaveProperty('userId');
    expect(post).toHaveProperty('publishDate');
    expect(post).toHaveProperty('_id');
  });

  it('should return 400 when userId query param is invalid', async () => {
    const response = await request(app)
      .get('/api/posts?userId=invalid-id')
      .expect(StatusCodes.BAD_REQUEST);

    expect(response.body).toHaveProperty('error', 'Invalid userId');
  });

  it('should return 500 when query fails (catch path)', async () => {
    const sort = jest.fn<(arg: unknown) => Promise<unknown>>().mockRejectedValue(new Error('boom'));
    jest.spyOn(Post, 'find').mockReturnValueOnce({
      sort,
    } as any);

    const response = await request(app)
      .get('/api/posts')
      .expect(StatusCodes.INTERNAL_SERVER_ERROR);

    expect(response.body).toHaveProperty('error', 'Failed to fetch posts');
  });
});

