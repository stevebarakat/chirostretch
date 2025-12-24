/**
 * GraphQL queries and mutations for WPGraphQL JWT Authentication
 */

export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: { provider: PASSWORD, credentials: { username: $username, password: $password } }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        email
        firstName
        lastName
        username
        roles {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(input: { refreshToken: $refreshToken }) {
      authToken
    }
  }
`;

/**
 * Revokes the user's refresh token secret, invalidating ALL sessions.
 * Use this for "log out everywhere" functionality.
 * For normal logout, just clear cookies (token expires naturally).
 */
export const REVOKE_USER_SECRET_MUTATION = `
  mutation RevokeUserSecret($userId: ID!) {
    revokeUserSecret(input: { userId: $userId }) {
      revokedUserSecret
      success
    }
  }
`;
