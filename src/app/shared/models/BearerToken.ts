export interface BearerToken {
  acr: string;
  aud: Array<string>;
  auth_time: number;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  preferred_username: string;
  realm_access: { roles: Array<string> };
  resource_access: { backend: { roles: Array<string> }, frontend: { roles: Array<string> }, account: { roles: Array<string> } };
  scope: string;
  session_state: string;
  sub: string;
  typ: string;
}
