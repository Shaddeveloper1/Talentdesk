import {
  describe, it, expect,
} from 'vitest';
import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('POST /api/submit', () => {
  it('returns 400 with all field errors when body is empty', async () => {
    // Send as multipart so multer can parse it; omit values to trigger validation
    const res = await request(app)
      .post('/api/submit')
      .field('name', '')
      .field('message', '');

    expect(res.status).toBe(400);
    expect(res.body.errors.name).toBeDefined();
    expect(res.body.errors.message).toBeDefined();
    expect(res.body.errors.file).toBeDefined();
  });

  it('returns 400 when name is too short', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'A')
      .field('message', 'This is a sufficiently long message for testing.');

    expect(res.status).toBe(400);
    expect(res.body.errors.name).toMatch(/at least 2/);
  });

  it('returns 400 when message is too short', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Ada Lovelace')
      .field('message', 'Short');

    expect(res.status).toBe(400);
    expect(res.body.errors.message).toMatch(/at least 10/);
  });

  it('returns 201 with file path on a valid submission', async () => {
    const fixturePath = path.join(__dirname, '../../README.md');

    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Ada Lovelace')
      .field('message', 'This is a sufficiently long and valid test message.')
      .attach('file', fixturePath);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Ada Lovelace');
    expect(res.body.file.path).toMatch(/^\/uploads\//);
  });
});
