/**
 * WPGraphQL JWT Authentication Types
 */

export type AuthTokens = {
  authToken: string;
  refreshToken: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginResponse = {
  login: {
    authToken: string;
    refreshToken: string;
    user: {
      id: string;
      databaseId: number;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      username: string;
    };
  };
};

export type RefreshTokenResponse = {
  refreshToken: {
    authToken: string;
  };
};

export type AuthUser = {
  id: string;
  databaseId: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};
