import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import { Post } from '../post.model';
import {
    mockPostByJohn,
    mockPostByJane,
    mockPostAnotherByJohn,
    mockPostOlderByJohn,
    mockPostNewerByJohn,
    mockPostMultiple,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb, getAuthToken } from '../../../tests/testDb';
import { User } from '../../users/user.model';

describe('GET /api/posts?userId=<userId> - Get posts by userId', () => {
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

  it('should return only posts from the specified user', async () => {
    const user1 = await User.create(mockUser);
    const user2 = await User.create({ ...mockUser, username: 'testuser2', email: 'test2@example.com' });
    await Post.insertMany([
      { ...mockPostByJohn, userId: user1._id },
      { ...mockPostByJane, userId: user2._id },
      { ...mockPostAnotherByJohn, userId: user1._id }
    ]);

    const response = await request(app)
      .get(`/api/posts?userId=${user1._id.toString()}`)
      .set('Authorization', getAuthToken())
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(2);
    response.body.data.forEach((post: any) => {
      expect(post.userId).toBe(user1._id.toString());
    });
  });

  it('should return empty array when user has no posts', async () => {
    const user1 = await User.create(mockUser);
    const user2 = await User.create({ ...mockUser, username: 'testuser2', email: 'test2@example.com' });
    await Post.insertMany([{ ...mockPostByJohn, userId: user1._id }]);

    const response = await request(app)
      .get(`/api/posts?userId=${user2._id.toString()}`)
      .set('Authorization', getAuthToken())
      .expect(StatusCodes.OK);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual([]);
  });

  it('should return posts sorted by publishDate descending', async () => {
    const user = await User.create(mockUser);
    await Post.insertMany([{ ...mockPostOlderByJohn, userId: user._id }, { ...mockPostNewerByJohn, userId: user._id }]);

    const response = await request(app)
      .get(`/api/posts?userId=${user._id.toString()}`)
      .set('Authorization', getAuthToken())
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].title).toBe('Newer Post by John');
    expect(response.body.data[1].title).toBe('Older Post by John');
  });

  it('should return all posts when sender query parameter is not provided', async () => {
    const user = await User.create(mockUser);
    await Post.insertMany(mockPostMultiple.map((p) => ({ ...p, userId: user._id })));

    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', getAuthToken())
      .expect(StatusCodes.OK);

    expect(response.body.data.length).toBe(2);
  });

  it('should return 400 for invalid userId query param', async () => {
    await request(app)
      .get('/api/posts?userId=not-an-objectid')
      .set('Authorization', getAuthToken())
      .expect(StatusCodes.BAD_REQUEST);
  });
});
