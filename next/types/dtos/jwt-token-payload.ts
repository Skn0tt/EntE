import { Roles } from "../roles";

export interface JwtTokenPayload {
  id: string;
  username: string;
  displayname: string;
  role: Roles;
  isAdmin: boolean;
  childrenIds: string[];
}
