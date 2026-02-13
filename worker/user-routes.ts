import { Hono } from "hono";
import type { Env } from './core-utils';
import { MemoryEntity, CheckpointEntity, AuditLogEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_METRICS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // HEALTH & METRICS
  app.get('/api/health/extended', async (c) => {
    return ok(c, {
      status: 'healthy',
      uptime: process.uptime?.() || 0,
      apiLatency: Math.floor(Math.random() * 50) + 10,
      memoryUsage: 42.5,
      timestamp: new Date().toISOString(),
      metrics: MOCK_METRICS
    });
  });
  // SEMANTIC MEMORY
  app.get('/api/memory', async (c) => {
    await MemoryEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    return ok(c, await MemoryEntity.list(c.env, cq ?? null, 50));
  });
  app.post('/api/memory', async (c) => {
    const body = await c.req.json();
    if (!body.content) return bad(c, 'content required');
    const memory = await MemoryEntity.create(c.env, {
      id: crypto.randomUUID(),
      content: body.content,
      vector: body.vector || [Math.random(), Math.random(), Math.random(), Math.random()],
      metadata: body.metadata || {},
      createdAt: Date.now()
    });
    return ok(c, memory);
  });
  app.post('/api/memory/retrieve', async (c) => {
    const { vector, limit } = await c.req.json();
    if (!Array.isArray(vector)) return bad(c, 'valid query vector required');
    const results = await MemoryEntity.search(c.env, vector, limit);
    return ok(c, results);
  });
  // CHECKPOINTS
  app.get('/api/checkpoints', async (c) => {
    await CheckpointEntity.ensureSeed(c.env);
    return ok(c, await CheckpointEntity.list(c.env, null, 100));
  });
  app.post('/api/checkpoints', async (c) => {
    const body = await c.req.json();
    if (!body.name) return bad(c, 'name required');
    const cp = await CheckpointEntity.create(c.env, {
      id: `cp-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      hash: crypto.randomUUID(),
      createdAt: Date.now()
    });
    return ok(c, cp);
  });
  // AUDIT LOGS
  app.get('/api/logs', async (c) => {
    await AuditLogEntity.ensureSeed(c.env);
    return ok(c, await AuditLogEntity.list(c.env, null, 100));
  });
}