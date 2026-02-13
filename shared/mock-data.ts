import type { SemanticMemory, Checkpoint, AuditLog, MetricPoint } from './types';
export const MOCK_MEMORIES: SemanticMemory[] = [
  {
    id: 'mem-001',
    content: 'Initial forensic baseline for system Alpha-9.',
    vector: [0.12, 0.88, -0.45, 0.67],
    metadata: { source: 'system-init', classification: 'internal' },
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'mem-002',
    content: 'Detected anomalous login pattern from subnet 192.168.1.0/24.',
    vector: [0.95, -0.12, 0.33, 0.11],
    metadata: { source: 'auth-monitor', classification: 'restricted' },
    createdAt: Date.now() - 3600000,
  },
];
export const MOCK_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-v1.0.0',
    name: 'Stable Baseline',
    description: 'First production release state.',
    hash: 'sha256-8f3e2b1c...',
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'cp-v1.0.1',
    name: 'Post-Audit Patch',
    description: 'Applied after Q3 security audit.',
    hash: 'sha256-a9d8f7e6...',
    createdAt: Date.now() - 43200000,
  }
];
export const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    action: 'RETRIEVE_MEMORY',
    actor: 'admin@nexus.io',
    resource: 'mem-001',
    timestamp: Date.now() - 1800000,
    status: 'success',
  },
  {
    id: 'log-2',
    action: 'CREATE_CHECKPOINT',
    actor: 'system-bot',
    resource: 'cp-v1.0.1',
    timestamp: Date.now() - 43200000,
    status: 'success',
  }
];
export const MOCK_METRICS: MetricPoint[] = [
  { time: '00:00', requests: 120, latency: 45, errors: 2 },
  { time: '04:00', requests: 80, latency: 42, errors: 0 },
  { time: '08:00', requests: 450, latency: 110, errors: 5 },
  { time: '12:00', requests: 980, latency: 165, errors: 12 },
  { time: '16:00', requests: 620, latency: 85, errors: 3 },
  { time: '20:00', requests: 310, latency: 55, errors: 1 },
];