import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: ".env.local" });

const REDIRECTS_QUERY = /* GraphQL */ `
  query GetRedirects {
    chsRedirects {
      fromPath
      toPath
      statusCode
      enabled
    }
  }
`;

type RedirectRule = {
  fromPath: string;
  toPath: string;
  statusCode: number;
  enabled: boolean;
};

type RedirectsQueryResponse = {
  data: {
    chsRedirects: RedirectRule[] | null;
  };
  errors?: unknown;
};

async function fetchRedirects(): Promise<RedirectRule[]> {
  const endpoint = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;

  if (!endpoint) {
    console.warn(
      "⚠️  NEXT_PUBLIC_WPGRAPHQL_ENDPOINT not set, skipping redirect generation"
    );
    return [];
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: REDIRECTS_QUERY }),
    });

    if (!response.ok) {
      console.warn(
        `⚠️  Failed to fetch redirects: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const json = (await response.json()) as RedirectsQueryResponse;

    if (json.errors) {
      console.warn("⚠️  GraphQL errors:", JSON.stringify(json.errors, null, 2));
      return [];
    }

    const rules = json.data?.chsRedirects ?? [];

    // Filter to enabled only
    return rules.filter((rule) => rule.enabled);
  } catch (error) {
    console.warn(
      "⚠️  Error fetching redirects:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

async function generateRedirects() {
  console.log("Generating redirect rules...");

  const rules = await fetchRedirects();

  // Write to project root (adjacent to src/)
  const outputPath = path.join(__dirname, "../generated-redirects.json");
  fs.writeFileSync(outputPath, JSON.stringify(rules, null, 2));

  console.log(`✅ Generated ${rules.length} redirect rules → generated-redirects.json`);
}

generateRedirects();
