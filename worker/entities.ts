import { IndexedEntity } from "./core-utils";
import type { SemanticMemory, Checkpoint, AuditLog } from "@shared/types";
import { MOCK_MEMORIES, MOCK_CHECKPOINTS, MOCK_LOGS } from "@shared/mock-data";
export class MemoryEntity extends IndexedEntity<SemanticMemory> {
  static readonly entityName = "memory";
  static readonly indexName = "memories";
  static readonly initialState: SemanticMemory = { 
    id: "", 
    content: "", 
    vector: [], 
    metadata: {}, 
    createdAt: 0 
  };
  static seedData = MOCK_MEMORIES;
  static async search(env: any, queryVector: number[], limit: number = 5): Promise<SemanticMemory[]> {
    const all = await this.list(env);
    // Simple cosine similarity simulation: Dot product of normalized vectors
    return all.items
      .map(item => {
        const dotProduct = item.vector.reduce((sum, val, i) => sum + (val * (queryVector[i] || 0)), 0);
        return { item, score: dotProduct };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(res => res.item);
  }
}
export class CheckpointEntity extends IndexedEntity<Checkpoint> {
  static readonly entityName = "checkpoint";
  static readonly indexName = "checkpoints";
  static readonly initialState: Checkpoint = { 
    id: "", 
    name: "", 
    description: "", 
    hash: "", 
    createdAt: 0 
  };
  static seedData = MOCK_CHECKPOINTS;
}
export class AuditLogEntity extends IndexedEntity<AuditLog> {
  static readonly entityName = "audit_log";
  static readonly indexName = "audit_logs";
  static readonly initialState: AuditLog = { 
    id: "", 
    action: "", 
    actor: "", 
    resource: "", 
    timestamp: 0, 
    status: "success" 
  };
  static seedData = MOCK_LOGS;
}