import OpenAI from "openai";
import type { ChunkRecord } from "./vectorStore";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY?.trim() });
  }
  return _client;
}

export interface Citation {
  title: string;
  url: string;
  sourceType: string;
  sourceId: string;
}

export interface ChatResult {
  answer: string;
  citations: Citation[];
}

const SYSTEM_PROMPT = `You are the ChiroStretch assistant. Answer ONLY using the provided context passages.
If the answer is not in the context, say "I don't have that information."
Never invent pricing, schedules, or policies. Cite your sources by referencing the passage numbers like [1], [2], etc.`;

function buildContext(chunks: ChunkRecord[]): string {
  return chunks
    .map(
      (chunk, i) =>
        `[${i + 1}] Title: ${chunk.title} | URL: ${chunk.url}\n${chunk.content}`
    )
    .join("\n\n---\n\n");
}

export async function generateAnswer(
  messages: { role: string; content: string }[],
  chunks: ChunkRecord[]
): Promise<ChatResult> {
  const model = process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini";
  const context = buildContext(chunks);

  const systemMessage = `${SYSTEM_PROMPT}\n\nContext:\n${context}`;

  const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemMessage },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const response = await getClient().chat.completions.create({
    model,
    messages: chatMessages,
    max_tokens: 512,
    temperature: 0.2,
  });

  const answer = response.choices[0]?.message?.content ?? "";

  // Deduplicate citations by URL
  const seen = new Set<string>();
  const citations: Citation[] = [];

  for (const chunk of chunks) {
    if (!seen.has(chunk.url)) {
      seen.add(chunk.url);
      citations.push({
        title: chunk.title,
        url: chunk.url,
        sourceType: chunk.sourceType,
        sourceId: chunk.sourceId,
      });
    }
  }

  return { answer, citations };
}
