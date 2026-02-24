import { getPool, isDatabaseAvailable } from "./db";

export interface ChunkRecord {
  sourceType: "page" | "location";
  sourceId: string;
  url: string;
  title: string;
  content: string;
  chunkIndex: number;
  updatedAt: Date;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

// ── In-memory fallback (no Postgres) ─────────────────────────────────────────

const memoryStore: ChunkRecord[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

function memoryUpsert(chunks: ChunkRecord[]): void {
  for (const chunk of chunks) {
    const idx = memoryStore.findIndex(
      (c) =>
        c.sourceType === chunk.sourceType &&
        c.sourceId === chunk.sourceId &&
        c.chunkIndex === chunk.chunkIndex,
    );
    if (idx >= 0) {
      memoryStore[idx] = chunk;
    } else {
      memoryStore.push(chunk);
    }
  }
}

function memoryQuery(
  embedding: number[],
  k: number,
  filters?: { sourceTypes?: string[] },
): ChunkRecord[] {
  let candidates = memoryStore;
  if (filters?.sourceTypes?.length) {
    candidates = candidates.filter((c) =>
      filters.sourceTypes!.includes(c.sourceType),
    );
  }
  return candidates
    .map((c) => ({
      record: c,
      score: cosineSimilarity(embedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((x) => x.record);
}

function memoryGetLatestUpdatedAt(
  sourceType: string,
  sourceId: string,
): Date | null {
  const matches = memoryStore.filter(
    (c) => c.sourceType === sourceType && c.sourceId === sourceId,
  );
  if (matches.length === 0) return null;
  return matches.reduce<Date>((latest, c) => {
    return c.updatedAt > latest ? c.updatedAt : latest;
  }, matches[0].updatedAt);
}

// ── pgvector implementation ───────────────────────────────────────────────────

async function pgUpsert(chunks: ChunkRecord[]): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete existing chunks for each unique source
    const sources = [
      ...new Map(
        chunks.map((c) => [`${c.sourceType}:${c.sourceId}`, c]),
      ).values(),
    ];

    for (const { sourceType, sourceId } of sources) {
      await client.query(
        "DELETE FROM ai_documents WHERE source_type = $1 AND source_id = $2",
        [sourceType, sourceId],
      );
    }

    // Batch insert
    for (const chunk of chunks) {
      await client.query(
        `INSERT INTO ai_documents
           (source_type, source_id, url, title, content, chunk_index, updated_at, embedding, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector, $9)`,
        [
          chunk.sourceType,
          chunk.sourceId,
          chunk.url,
          chunk.title,
          chunk.content,
          chunk.chunkIndex,
          chunk.updatedAt,
          `[${chunk.embedding.join(",")}]`,
          JSON.stringify(chunk.metadata ?? {}),
        ],
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function pgQuery(
  embedding: number[],
  k: number,
  filters?: { sourceTypes?: string[] },
): Promise<ChunkRecord[]> {
  const pool = getPool();
  const embeddingStr = `[${embedding.join(",")}]`;

  let sql = `
    SELECT source_type, source_id, url, title, content, chunk_index, updated_at, metadata
    FROM ai_documents
  `;
  const params: unknown[] = [embeddingStr, k];

  if (filters?.sourceTypes?.length) {
    sql += ` WHERE source_type = ANY($3)`;
    params.push(filters.sourceTypes);
  }

  sql += ` ORDER BY embedding <=> $1::vector LIMIT $2`;

  const result = await pool.query(sql, params);

  return result.rows.map((row) => ({
    sourceType: row.source_type as "page" | "location",
    sourceId: row.source_id,
    url: row.url,
    title: row.title,
    content: row.content,
    chunkIndex: row.chunk_index,
    updatedAt: row.updated_at,
    embedding: [], // not returned from query (large)
    metadata: row.metadata,
  }));
}

async function pgGetLatestUpdatedAt(
  sourceType: string,
  sourceId: string,
): Promise<Date | null> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT MAX(updated_at) AS latest
     FROM ai_documents
     WHERE source_type = $1 AND source_id = $2`,
    [sourceType, sourceId],
  );
  const val = result.rows[0]?.latest;
  return val ? new Date(val) : null;
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function upsertChunks(chunks: ChunkRecord[]): Promise<void> {
  if (isDatabaseAvailable()) {
    return pgUpsert(chunks);
  }
  memoryUpsert(chunks);
}

export async function querySimilar(
  embedding: number[],
  k = 6,
  filters?: { sourceTypes?: string[] },
): Promise<ChunkRecord[]> {
  if (isDatabaseAvailable()) {
    return pgQuery(embedding, k, filters);
  }
  return memoryQuery(embedding, k, filters);
}

export async function getLatestUpdatedAt(
  sourceType: string,
  sourceId: string,
): Promise<Date | null> {
  if (isDatabaseAvailable()) {
    return pgGetLatestUpdatedAt(sourceType, sourceId);
  }
  return memoryGetLatestUpdatedAt(sourceType, sourceId);
}
