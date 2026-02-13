export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: number;
  apiLatency: number;
  memoryUsage: number;
  timestamp: string;
}
export interface SemanticMemory {
  id: string;
  content: string;
  vector: number[];
  metadata: Record<string, unknown>;
  createdAt: number;
}
export interface Checkpoint {
  id: string;
  name: string;
  description: string;
  hash: string;
  createdAt: number;
}
export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  resource: string;
  timestamp: number;
  status: 'success' | 'failure';
}
export interface MetricPoint {
  time: string;
  requests: number;
  latency: number;
  errors: number;
}