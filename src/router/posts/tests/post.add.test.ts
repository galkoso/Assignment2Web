import request from 'supertest';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import postRouter from '../post.router';
import {
    mockPostData,
    mockPostDataWithoutPublishDate,
    mockPostWithoutTitle,
    mockPostWithoutContent,
    mockPostWithoutUserId,
    mockUser
} from '../../mocks';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../../../tests/testDb';
import { User } from '../../users/user.model';

describe('POST /api/posts - Add a new post', () => {
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

  it('should create a new post successfully', async () => {
    const user = await User.create(mockUser);
    const postData = { ...mockPostData, userId: user._id.toString() };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(StatusCodes.CREATED);

    expect(response.body).toHaveProperty('message', 'Post created successfully');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('title', postData.title);
    expect(response.body.data).toHaveProperty('content', postData.content);
    expect(response.body.data).toHaveProperty('userId');
    expect(response.body.data).toHaveProperty('publishDate');
    expect(response.body.data).toHaveProperty('_id');
  });

  it('should fail when title is missing', async () => {
    const user = await User.create(mockUser);
    const postData = { ...mockPostWithoutTitle, userId: user._id.toString() };

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it('should fail when content is missing', async () => {
    const user = await User.create(mockUser);
    const postData = { ...mockPostWithoutContent, userId: user._id.toString() };

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it('should fail when author is missing', async () => {
    const postData = mockPostWithoutUserId;

    await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  it('should use default publishDate when not provided', async () => {
    const user = await User.create(mockUser);
    const postData = { ...mockPostDataWithoutPublishDate, userId: user._id.toString() };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(StatusCodes.CREATED);

    expect(response.body.data).toHaveProperty('publishDate');
    expect(new Date(response.body.data.publishDate)).toBeInstanceOf(Date);
  });
});

