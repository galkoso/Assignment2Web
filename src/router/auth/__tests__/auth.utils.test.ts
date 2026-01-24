import { describe, it, expect } from '@jest/globals';
import { signRefreshToken, verifyRefreshToken, signAccessToken, verifyAccessToken } from '../auth.utils';

describe('Auth Utils - Refresh Token Functions', () => {
  it('should sign a refresh token', () => {
    const payload = { username: 'testuser' };
    const token = signRefreshToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should verify a valid refresh token', () => {
    const payload = { username: 'testuser' };
    const token = signRefreshToken(payload);
    const verified = verifyRefreshToken(token);

    expect(verified).toBeDefined();
    expect(verified.username).toBe('testuser');
  });

  it('should throw error when verifying invalid refresh token', () => {
    const invalidToken = 'invalid-refresh-token';

    expect(() => {
      verifyRefreshToken(invalidToken);
    }).toThrow();
  });

  it('should throw error when verifying expired refresh token', () => {
    expect(() => {
      verifyRefreshToken('wrong-secret-token');
    }).toThrow();
  });

  it('should create different tokens for different payloads', () => {
    const token1 = signRefreshToken({ username: 'user1' });
    const token2 = signRefreshToken({ username: 'user2' });

    expect(token1).not.toBe(token2);
  });

  it('should verify refresh token and return correct payload', () => {
    const username = 'testuser';
    const token = signRefreshToken({ username });
    const verified = verifyRefreshToken(token);

    expect(verified.username).toBe(username);
  });
});

describe('Auth Utils - Access Token Functions (for completeness)', () => {
  it('should sign and verify access token', () => {
    const payload = { username: 'testuser' };
    const token = signAccessToken(payload);
    const verified = verifyAccessToken(token);

    expect(verified.username).toBe('testuser');
  });

  it('should throw error when verifying invalid access token', () => {
    expect(() => {
      verifyAccessToken('invalid-token');
    }).toThrow();
  });
});
