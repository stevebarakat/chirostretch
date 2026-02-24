import { NextRequest, NextResponse } from "next/server";
import { embedTexts } from "@/lib/ai/embeddings";
import { querySimilar } from "@/lib/ai/vectorStore";
import { generateAnswer } from "@/lib/ai/chat";

// ── Rate limiting (in-memory, per IP, 10 req/min) ────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// ── Route handler ─────────────────────────────────────────────────────────────

interface ChatRequestBody {
  messages: { role: string; content: string }[];
  context?: { sourceTypes?: string[] };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // Parse body
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages, context } = body;

  // Validate
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array." },
      { status: 400 }
    );
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== "user") {
    return NextResponse.json(
      { error: "Last message must have role 'user'." },
      { status: 400 }
    );
  }

  if (
    typeof lastMessage.content !== "string" ||
    lastMessage.content.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "Last message content must be a non-empty string." },
      { status: 400 }
    );
  }

  if (lastMessage.content.length > 1000) {
    return NextResponse.json(
      { error: "Message content exceeds 1000 character limit." },
      { status: 400 }
    );
  }

  try {
    // Embed the user query
    const [queryEmbedding] = await embedTexts([lastMessage.content]);

    // Retrieve similar chunks
    const chunks = await querySimilar(queryEmbedding, 6, {
      sourceTypes: context?.sourceTypes,
    });

    // Generate answer
    const result = await generateAnswer(messages, chunks);

    const responseBody: {
      answer: string;
      citations: typeof result.citations;
      debug?: { retrieved: typeof chunks };
    } = {
      answer: result.answer,
      citations: result.citations,
    };

    if (process.env.NODE_ENV === "development") {
      responseBody.debug = { retrieved: chunks };
    }

    return NextResponse.json(responseBody);
  } catch (err) {
    console.error("[ai/chat] Error:", err);
    return NextResponse.json(
      { error: "An error occurred while generating the response." },
      { status: 500 }
    );
  }
}
