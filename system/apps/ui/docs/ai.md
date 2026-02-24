# AI Knowledge Index & Chat (RAG)

ChiroStretch includes an optional AI-powered chat widget backed by a pgvector knowledge index. It ingests WordPress Pages and Locations, stores embeddings in Postgres, and answers user questions grounded in that content.

---

## Architecture

```
WordPress (Pages + Locations)
  └─ scripts/ai/ingest.ts
       └─ stripHtml → chunkText → embedTexts (OpenAI)
            └─ upsertChunks → pgvector (ai_documents table)

User question (ChatWidget)
  └─ POST /api/ai/chat
       └─ embedTexts(query) → querySimilar (pgvector <=> cosine)
            └─ generateAnswer (OpenAI chat, grounded context)
                 └─ { answer, citations }
```

---

## Setup

### 1. Environment Variables

Add to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
OPENAI_CHAT_MODEL=gpt-4o-mini        # optional, default shown
OPENAI_EMBED_MODEL=text-embedding-3-small  # optional, default shown
DATABASE_URL=postgres://user:pass@localhost:5432/chirostretch
```

### 2. Run the Migration

```bash
psql $DATABASE_URL -f system/apps/ui/migrations/001_ai_documents.sql
```

This creates the `ai_documents` table with a `vector(1536)` column. Requires [pgvector](https://github.com/pgvector/pgvector).

### 3. Ingest Content

From `system/apps/ui/`:

```bash
# Incremental (skips unchanged content)
pnpm ai:ingest

# Force re-ingest everything
pnpm ai:ingest:full
```

Expected output:
```
ChiroStretch AI Ingestion — incremental mode

Fetched 24 pages from WordPress
  ✓ Page: About Us (2 chunks)
  ...
Fetched 8 locations from WordPress
  ✓ Location: Chicago North (3 chunks)
  ...

Ingestion complete:
  Pages:     31 chunks upserted, 3 skipped
  Locations: 18 chunks upserted, 0 skipped
  Total:     49 chunks upserted, 3 skipped
```

### 4. Add the Widget to Your Layout

```tsx
// src/app/(site)/layout.tsx
import { ChatWidget } from "@/components/ai/ChatWidget";

export default function SiteLayout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

---

## Ingestion Details

| Field | Source |
|-------|--------|
| Pages | `id`, `databaseId`, `uri`, `title`, `content`, `modified` |
| Locations | `id`, `databaseId`, `slug`, `title`, `content`, `shortDescription`, `servicesOffered`, `city`, `state`, `streetAddress`, `phone`, `modified` |

Chunking: paragraph-based, max 1000 chars with 150-char overlap. Minimum chunk size: 50 chars.

---

## API Reference

### `POST /api/ai/chat`

**Request:**
```json
{
  "messages": [{ "role": "user", "content": "What services does ChiroStretch offer?" }],
  "context": { "sourceTypes": ["page", "location"] }
}
```

**Response:**
```json
{
  "answer": "ChiroStretch offers chiropractic care, assisted stretching...",
  "citations": [
    { "title": "Services", "url": "https://chirostretch.com/services", "sourceType": "page", "sourceId": "42" }
  ]
}
```

**Rate limit:** 10 requests per minute per IP.

---

## Dev Utilities

```bash
# Reset the knowledge index (dev only)
pnpm ai:reset
```

---

## Performance Notes

After loading initial data, add the ivfflat index for faster similarity search:

```sql
CREATE INDEX CONCURRENTLY ai_documents_embedding_idx
  ON ai_documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

Run `ANALYZE ai_documents;` after adding data.

---

## No Postgres? In-Memory Fallback

If `DATABASE_URL` is not set, the vector store falls back to an in-memory implementation using cosine similarity. This is useful for smoke testing without Postgres, but data is not persisted between server restarts.

---

## Adding New Content Sources

1. Add a WPGraphQL query to `src/lib/ai/wpgraphql.ts`
2. Add an ingestion step in `scripts/ai/ingest.ts`
3. The `source_type` column in `ai_documents` accepts any string — add a new CHECK constraint value if needed

---

## Security

- The system prompt explicitly forbids inventing facts
- Input is validated and capped at 1000 characters
- Rate limiting: 10 req/min per IP (in-memory; replace with Redis for multi-instance deployments)
- OpenAI API key is server-side only
