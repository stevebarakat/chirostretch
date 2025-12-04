/**
 * GraphQL queries and mutations for WPGraphQL JWT Authentication
 */

export const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        email
        firstName
        lastName
        username
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout(input: {}) {
      status
    }
  }
`;
