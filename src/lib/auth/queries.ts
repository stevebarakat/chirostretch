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

export const LOGOUT_MUTATION = `
  mutation Logout {
    logout(input: {}) {
      status
    }
  }
`;
