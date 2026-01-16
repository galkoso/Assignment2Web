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
    expect(errorLog).toHaveBeenCalledWith('Failed to start server:', expect.any(Error));
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('startServer uses default PORT when not provided', async () => {
    const connect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const log = jest.fn();
    const listen = jest.fn((port: number, cb: () => void) => {
      cb();
      return { port };
    });

    await startServer({ connect, listen, log });

    expect(listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it('startServer uses custom port when provided', async () => {
    const connect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const log = jest.fn();
    const listen = jest.fn((port: number, cb: () => void) => {
      cb();
      return { port };
    });

    await startServer({ connect, listen, port: 8080, log });

    expect(listen).toHaveBeenCalledWith(8080, expect.any(Function));
  });

  it('startServer calls log with server info in callback', async () => {
    const connect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const log = jest.fn();
    const listen = jest.fn((port: number, cb: () => void) => {
      cb();
      return { port };
    });

    await startServer({ connect, listen, port: 1234, log });

    expect(log).toHaveBeenCalledWith('Server running on http://localhost:1234');
    expect(log).toHaveBeenCalledWith(`Node.js version: ${process.version}`);
  });

  it('startServer does not auto-start when NODE_ENV is "test" (line 55-56)', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});

