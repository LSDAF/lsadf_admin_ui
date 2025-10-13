// Keycloak token structure
export interface KeycloakToken {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  preferred_username: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
}

// User profile from Keycloak
export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  roles: string[];
}

// Authentication state
export interface AuthState {
  isAuthenticated: boolean;
  user?: KeycloakUser;
  token?: string;
  roles: string[];
}
