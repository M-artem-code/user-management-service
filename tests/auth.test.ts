import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock(
  '../src/repositories/user.repository',
  () => import('./fakeUserRepository')
);

import app from '../src/app';
import { hashPassword } from '../src/utils/password';
import * as repo from './fakeUserRepository';
import { refreshTokenFor, validRegisterBody } from './helpers';

beforeEach(() => repo.reset());
afterEach(() => vi.clearAllMocks());

describe('POST /api/auth/register', () => {
  it('registers a new user with role forced to "user"', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterBody());

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe('user@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('ignores an injected admin role (privilege escalation blocked)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterBody({ role: 'admin' }));

    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('user');
  });

  it('rejects mismatched passwords with 400 + validation errors', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterBody({ passwordConfirm: 'different' }));

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(
      res.body.errors.some((e: any) => e.path.includes('passwordConfirm'))
    ).toBe(true);
  });

  it('rejects an invalid email with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterBody({ email: 'not-an-email' }));

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('returns 409 when the email already exists', async () => {
    repo.seed({ email: 'user@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send(validRegisterBody());

    expect(res.status).toBe(409);
    expect(res.body.status).toBe('fail');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with valid credentials and sets auth cookies', async () => {
    const password = await hashPassword('password123');
    repo.seed({ email: 'user@example.com', password });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies.some((c) => c.startsWith('access_token='))).toBe(true);
    expect(cookies.some((c) => c.startsWith('refresh_token='))).toBe(true);
  });

  it('rejects a wrong password with 400', async () => {
    const password = await hashPassword('password123');
    repo.seed({ email: 'user@example.com', password });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
  });

  it('blocks login for a deactivated account with 403', async () => {
    const password = await hashPassword('password123');
    repo.seed({ email: 'user@example.com', password, isActive: false });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/auth/refresh', () => {
  it('issues a new access token from a valid refresh cookie', async () => {
    const user = repo.seed();

    const res = await request(app)
      .get('/api/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshTokenFor(user.id)}`]);

    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeDefined();
  });

  it('returns 403 without a refresh token', async () => {
    const res = await request(app).get('/api/auth/refresh');
    expect(res.status).toBe(403);
  });
});
