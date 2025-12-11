import { cookies } from "next/headers";
import { wpGraphQLFetch } from "@/lib/wpgraphql";

export default async function AuthTestPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("wp-auth-token")?.value;
  const refreshToken = cookieStore.get("wp-refresh-token")?.value;

  let testResult = null;
  let error = null;

  if (authToken) {
    try {
      const data = await wpGraphQLFetch<{
        viewer: { id: string; email: string; username: string } | null;
      }>({
        query: `
          query TestAuth {
            viewer {
              id
              databaseId
              email
              username
            }
          }
        `,
        auth: true,
      });
      testResult = data;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Authentication Test</h1>

      <h2>Cookies</h2>
      <div style={{ background: "#f5f5f5", padding: "1rem", marginBottom: "1rem" }}>
        <p>
          <strong>Auth Token:</strong>{" "}
          {authToken ? `${authToken.substring(0, 50)}...` : "NOT SET"}
        </p>
        <p>
          <strong>Refresh Token:</strong>{" "}
          {refreshToken ? `${refreshToken.substring(0, 50)}...` : "NOT SET"}
        </p>
      </div>

      <h2>GraphQL Test</h2>
      {!authToken && (
        <p style={{ color: "red" }}>
          ❌ No auth token found. You are not logged in.
        </p>
      )}
      {authToken && error && (
        <div style={{ background: "#fee", padding: "1rem", marginBottom: "1rem" }}>
          <p style={{ color: "red" }}>❌ GraphQL Error:</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>
        </div>
      )}
      {authToken && testResult && (
        <div style={{ background: "#efe", padding: "1rem" }}>
          {testResult.viewer ? (
            <>
              <p style={{ color: "green" }}>✅ Authentication successful!</p>
              <pre>{JSON.stringify(testResult.viewer, null, 2)}</pre>
            </>
          ) : (
            <p style={{ color: "orange" }}>
              ⚠️  Token exists but WordPress doesn't recognize it (viewer is null)
            </p>
          )}
        </div>
      )}

      <h2>What to do</h2>
      <ul>
        <li>
          If cookies are NOT SET: <a href="/login">Go to login page</a> and log in
        </li>
        <li>
          If token exists but viewer is null: The JWT token is invalid or not
          recognized by WordPress. Try logging out and logging in again.
        </li>
        <li>
          If authentication successful: Your auth is working! The issue is elsewhere.
        </li>
      </ul>
    </div>
  );
}
