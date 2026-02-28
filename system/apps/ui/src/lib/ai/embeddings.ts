import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });
  }
  return _client;
}

const BATCH_SIZE = 32;
const MAX_INPUT_CHARS = 8000;
const MAX_RETRIES = 3;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedBatch(
  texts: string[],
  model: string
): Promise<number[][]> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await getClient().embeddings.create({
        model,
        input: texts,
      });
      return response.data.map((d) => d.embedding);
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) throw err;
      await sleep(1000 * Math.pow(2, attempt));
    }
  }
  throw new Error("embedBatch: unreachable");
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const model =
    process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";

  const truncated = texts.map((t) => {
    if (t.length > MAX_INPUT_CHARS) {
      console.warn(
        `embedTexts: truncating input from ${t.length} to ${MAX_INPUT_CHARS} chars`
      );
      return t.slice(0, MAX_INPUT_CHARS);
    }
    return t;
  });

  const results: number[][] = [];

  for (let i = 0; i < truncated.length; i += BATCH_SIZE) {
    const batch = truncated.slice(i, i + BATCH_SIZE);
    const embeddings = await embedBatch(batch, model);
    results.push(...embeddings);
  }

  return results;
}
