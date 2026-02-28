/**
 * AI Knowledge Index — Ingestion Script
 *
 * Usage:
 *   pnpm ai:ingest           # incremental (skip unchanged)
 *   pnpm ai:ingest:full      # force re-ingest all
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load env files in a way that works no matter where the script is invoked from.
// Priority:
// 1) Nearest directory (walking up from process.cwd) containing .env.local/.env
// 2) UI app root derived from this file path (system/apps/ui)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function findNearestEnvRoot(startDir: string): string | null {
  let dir = startDir;
  for (let i = 0; i < 8; i++) {
    const hasEnvLocal = fs.existsSync(path.join(dir, ".env.local"));
    const hasEnv = fs.existsSync(path.join(dir, ".env"));
    if (hasEnvLocal || hasEnv) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// This file lives at: system/apps/ui/scripts/ai/ingest.ts
// UI app root is:      system/apps/ui
const uiRootFromFile = path.resolve(__dirname, "..", "..");
const repoRootFromFile = path.resolve(uiRootFromFile, "..", "..", "..");

const envRoot = findNearestEnvRoot(process.cwd()) ?? uiRootFromFile;
const repoRoot = repoRootFromFile;

// Prefer env files at envRoot first (Next.js convention)
config({ path: path.join(envRoot, ".env") });
config({ path: path.join(envRoot, ".env.local"), override: true });

// Fallback: also load repo-root env files if present (useful when running from monorepo root)
config({ path: path.join(repoRoot, ".env"), override: false });
config({ path: path.join(repoRoot, ".env.local"), override: false });
import {
  fetchAllPages,
  fetchAllLocations,
  stripHtml,
  normalizeWhitespace,
  type WPPage,
  type WPLocation,
} from "../../src/lib/ai/wpgraphql.js";
import { chunkText } from "../../src/lib/ai/chunk.js";
import { embedTexts } from "../../src/lib/ai/embeddings.js";
import {
  upsertChunks,
  getLatestUpdatedAt,
  type ChunkRecord,
} from "../../src/lib/ai/vectorStore.js";

const isFull = process.argv.includes("--full");

function buildPageText(page: WPPage): string {
  return normalizeWhitespace(
    `${page.title}\n\n${stripHtml(page.content ?? "")}`,
  );
}

function buildLocationText(loc: WPLocation): string {
  const parts = [
    loc.title,
    [loc.city, loc.state].filter(Boolean).join(", "),
    loc.streetAddress,
    loc.phone,
    "",
    stripHtml(loc.content ?? ""),
    loc.shortDescription ?? "",
    loc.servicesOffered ?? "",
  ]
    .filter(Boolean)
    .join("\n");
  return normalizeWhitespace(parts);
}

async function ingestPages(): Promise<{ upserted: number; skipped: number }> {
  const pages = await fetchAllPages();
  console.log(`Fetched ${pages.length} pages from WordPress`);

  let upserted = 0;
  let skipped = 0;

  for (const page of pages) {
    const sourceId = String(page.databaseId);
    const wpModified = page.modified ? new Date(page.modified) : new Date();

    if (!isFull) {
      const dbUpdatedAt = await getLatestUpdatedAt("page", sourceId);
      if (dbUpdatedAt && dbUpdatedAt >= wpModified) {
        skipped++;
        continue;
      }
    }

    const text = buildPageText(page);
    if (text.length < 50) {
      skipped++;
      continue;
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) {
      skipped++;
      continue;
    }

    const chunkTexts = chunks.map((c) => c.chunkText);
    const embeddings = await embedTexts(chunkTexts);

    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";
    const url = `${frontendUrl}${page.uri ?? `/${page.databaseId}`}`;

    const records: ChunkRecord[] = chunks.map((chunk, i) => ({
      sourceType: "page",
      sourceId,
      url,
      title: page.title ?? "Untitled",
      content: chunk.chunkText,
      chunkIndex: chunk.chunkIndex,
      updatedAt: wpModified,
      embedding: embeddings[i],
      metadata: { uri: page.uri },
    }));

    await upsertChunks(records);
    upserted += records.length;
    console.log(`  ✓ Page: ${page.title} (${records.length} chunks)`);
  }

  return { upserted, skipped };
}

async function ingestLocations(): Promise<{
  upserted: number;
  skipped: number;
}> {
  const locations = await fetchAllLocations();
  console.log(`Fetched ${locations.length} locations from WordPress`);

  let upserted = 0;
  let skipped = 0;

  for (const loc of locations) {
    const sourceId = String(loc.databaseId);
    const wpModified = loc.modified ? new Date(loc.modified) : new Date();

    if (!isFull) {
      const dbUpdatedAt = await getLatestUpdatedAt("location", sourceId);
      if (dbUpdatedAt && dbUpdatedAt >= wpModified) {
        skipped++;
        continue;
      }
    }

    const text = buildLocationText(loc);
    if (text.length < 50) {
      skipped++;
      continue;
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) {
      skipped++;
      continue;
    }

    const chunkTexts = chunks.map((c) => c.chunkText);
    const embeddings = await embedTexts(chunkTexts);

    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";
    const url = `${frontendUrl}/locations/${loc.slug}`;

    const records: ChunkRecord[] = chunks.map((chunk, i) => ({
      sourceType: "location",
      sourceId,
      url,
      title: loc.title ?? "Untitled Location",
      content: chunk.chunkText,
      chunkIndex: chunk.chunkIndex,
      updatedAt: wpModified,
      embedding: embeddings[i],
      metadata: { slug: loc.slug, city: loc.city, state: loc.state },
    }));

    await upsertChunks(records);
    upserted += records.length;
    console.log(`  ✓ Location: ${loc.title} (${records.length} chunks)`);
  }

  return { upserted, skipped };
}

async function main() {
  console.log(
    `\nChiroStretch AI Ingestion — ${isFull ? "FULL" : "incremental"} mode\n`,
  );

  const pageResult = await ingestPages();
  const locationResult = await ingestLocations();

  const totalChunks = pageResult.upserted + locationResult.upserted;
  const totalSkipped = pageResult.skipped + locationResult.skipped;

  console.log(`
Ingestion complete:
  Pages:     ${pageResult.upserted} chunks upserted, ${pageResult.skipped} skipped
  Locations: ${locationResult.upserted} chunks upserted, ${locationResult.skipped} skipped
  Total:     ${totalChunks} chunks upserted, ${totalSkipped} skipped
`);

  process.exit(0);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
