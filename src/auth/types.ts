export interface KeycloakUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  roles: string[];
}

export interface KeycloakTokenParsed {
  sub?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  realm_access?: {
    roles: string[];
  };
}
