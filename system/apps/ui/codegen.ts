import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: {
    [process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ||
    "https://chirostretch-copy.local/graphql"]: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
  documents: ["src/**/*.ts", "src/**/*.tsx", "!src/lib/graphql/generated/**"],
  ignoreNoDocuments: true,
  generates: {
    "src/lib/graphql/generated/graphql.ts": {
      plugins: ["typescript"],
      config: {
        useTypeImports: true,
        skipTypename: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        maybeValue: "T | undefined",
        scalars: {
          JSON: "unknown",
        },
      },
    },
  },
};

export default config;
