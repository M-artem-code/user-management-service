import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock(
  '../src/repositories/user.repository',
  () => import('./fakeUserRepository')
);

import app from '../src/app';
import * as repo from './fakeUserRepository';
import { bearerFor } from './helpers';

beforeEach(() => repo.reset());

describe('auth guard', () => {
  it('rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users (admin only, paginated)', () => {
  it('forbids non-admins with 403', async () => {
    const user = repo.seed({ role: 'user' });

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', bearerFor(user.id));

    expect(res.status).toBe(403);
  });

  it('allows admins and returns pagination metadata', async () => {
    const admin = repo.seed({ role: 'admin' });
    for (let i = 0; i < 25; i++) repo.seed({ role: 'user' });

    const res = await request(app)
      .get('/api/users?page=1&limit=10')
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(200);
    expect(res.body.results).toBe(10);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 10 });
    expect(res.body.pagination.total).toBe(26);
    expect(res.body.pagination.totalPages).toBe(3);
    expect(res.body.data.users[0]).not.toHaveProperty('password');
  });

  it('rejects an invalid pagination query with 400', async () => {
    const admin = repo.seed({ role: 'admin' });

    const res = await request(app)
      .get('/api/users?limit=abc')
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });
});

describe('GET /api/users/:id (admin or self)', () => {
  it('lets a user fetch their own record', async () => {
    const user = repo.seed({ role: 'user' });

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set('Authorization', bearerFor(user.id));

    expect(res.status).toBe(200);
    expect(res.body.data.user.id).toBe(user.id);
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('forbids a user from fetching someone else', async () => {
    const user = repo.seed({ role: 'user' });
    const other = repo.seed({ role: 'user' });

    const res = await request(app)
      .get(`/api/users/${other.id}`)
      .set('Authorization', bearerFor(user.id));

    expect(res.status).toBe(403);
  });

  it('lets an admin fetch any user', async () => {
    const admin = repo.seed({ role: 'admin' });
    const target = repo.seed({ role: 'user' });

    const res = await request(app)
      .get(`/api/users/${target.id}`)
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(200);
    expect(res.body.data.user.id).toBe(target.id);
  });

  it('returns 400 for a malformed (non-uuid) id', async () => {
    const admin = repo.seed({ role: 'admin' });

    const res = await request(app)
      .get('/api/users/not-a-uuid')
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('fail');
  });

  it('returns 404 for a non-existent (valid uuid) id', async () => {
    const admin = repo.seed({ role: 'admin' });

    const res = await request(app)
      .get('/api/users/00000000-0000-4000-8000-000000000000')
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/users/:id/block', () => {
  it('lets an admin block another user', async () => {
    const admin = repo.seed({ role: 'admin' });
    const target = repo.seed({ role: 'user', isActive: true });

    const res = await request(app)
      .patch(`/api/users/${target.id}/block`)
      .set('Authorization', bearerFor(admin.id));

    expect(res.status).toBe(200);
    expect(res.body.data.user.isActive).toBe(false);
  });

  it('forbids blocking another user as a non-admin', async () => {
    const user = repo.seed({ role: 'user' });
    const other = repo.seed({ role: 'user' });

    const res = await request(app)
      .patch(`/api/users/${other.id}/block`)
      .set('Authorization', bearerFor(user.id));

    expect(res.status).toBe(403);
  });
});

describe('unknown routes', () => {
  it('returns 404 with the unified error shape', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('fail');
    expect(res.body.message).toContain('not found');
  });
});
