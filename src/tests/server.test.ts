import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { app } from '../server';

describe('server.ts', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health').expect(StatusCodes.OK);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

