export interface User {
  id: string; // UUID as string
  firstName: string;
  lastName: string;
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  userRoles: string[];
  createdTimestamp: string; // ISO date string
}
