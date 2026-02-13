import { Hono } from "hono";
import type { Env } from './core-utils';
import { MemoryEntity, CheckpointEntity, AuditLogEntity } from "./entities";
import { ok, bad } from './core-utils';
import { MOCK_METRICS } from "@shared/mock-data";
// Worker boot time tracking for uptime calculation without 'process'
const WORKER_START_TIME = Date.now();
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // HEALTH & METRICS
  app.get('/api/health/extended', async (c) => {
    const uptimeSeconds = Math.floor((Date.now() - WORKER_START_TIME) / 1000);
    return ok(c, {
      status: 'healthy',
      uptime: uptimeSeconds,
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
    const list = await CheckpointEntity.list(c.env, null, 100);
    // Ensure chronological sorting for the timeline
    list.items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, list);
  });
  app.post('/api/checkpoints', async (c) => {
    const body = await c.req.json();
    if (!body.name) return bad(c, 'name required');
    const cp = await CheckpointEntity.create(c.env, {
      id: `cp-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      hash: crypto.randomUUID().replace(/-/g, ''),
      createdAt: Date.now()
    });
    return ok(c, cp);
  });
  app.post('/api/checkpoints/rollback', async (c) => {
    const { id } = await c.req.json();
    if (!id) return bad(c, 'checkpoint id required');
    // Simulated rollback logic
    return ok(c, { restoredId: id, status: 'RECOVERY_COMPLETE', timestamp: Date.now() });
  });
  // AUDIT LOGS
  app.get('/api/logs', async (c) => {
    await AuditLogEntity.ensureSeed(c.env);
    const list = await AuditLogEntity.list(c.env, null, 100);
    list.items.sort((a, b) => b.timestamp - a.timestamp);
    return ok(c, list);
  });
}