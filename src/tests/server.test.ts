import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { app, startServer } from '../server';
import { jest } from '@jest/globals';

describe('server.ts', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health').expect(StatusCodes.OK);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('startServer connects and listens (success path)', async () => {
    const connect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const log = jest.fn();
    const errorLog = jest.fn();
    const exit = jest.fn(() => {
      throw new Error('process.exit called');
    }) as unknown as (code: number) => never;

    const listen = jest.fn((port: number, cb: () => void) => {
      cb();
      return { port };
    });

    await startServer({ connect, listen, port: 1234, log, errorLog, exit });

    expect(connect).toHaveBeenCalledTimes(1);
    expect(exit).not.toHaveBeenCalled();
  });

  it('startServer exits on failure (error path)', async () => {
    const connect = jest.fn<() => Promise<void>>().mockRejectedValue(new Error('db down'));
    const log = jest.fn();
    const errorLog = jest.fn();
    const exit = jest.fn(() => {
      throw new Error('exit');
    }) as unknown as (code: number) => never;
    const listen = jest.fn();

    await expect(startServer({ connect, listen, port: 1234, log, errorLog, exit })).rejects.toThrow('exit');

    expect(connect).toHaveBeenCalledTimes(1);
  });
});

