import { NextResponse } from "next/server";

const INTROSPECTION_QUERY = `
  query IntrospectLogin {
    passwordInput: __type(name: "PasswordProviderResponseInput") {
      name
      kind
      inputFields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
    loginInput: __type(name: "LoginInput") {
      name
      kind
      inputFields {
        name
        description
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

/**
 * GET /api/auth/debug-schema
 * Debug endpoint to introspect the WordPress GraphQL schema
 */
export async function GET() {
  try {
    const wpGraphqlUrl =
      process.env.WORDPRESS_GRAPHQL_ENDPOINT ??
      process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT ??
      process.env.WP_GRAPHQL_ENDPOINT ??
      "http://chirostretch-copy.local/graphql";

    const response = await fetch(wpGraphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: INTROSPECTION_QUERY,
      }),
    });

    const data = await response.json();

    return NextResponse.json(
      {
        passwordInput: data.data?.passwordInput,
        loginInput: data.data?.loginInput,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Schema introspection error:", error);
    return NextResponse.json(
      {
        error: "Failed to introspect schema",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
