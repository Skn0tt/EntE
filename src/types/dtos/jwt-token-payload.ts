import { Roles } from "../roles";

export interface JwtTokenPayload {
  id: string;
  username: string;
  role: Roles;
  isAdmin: boolean;
  childrenIds: string[];
}
