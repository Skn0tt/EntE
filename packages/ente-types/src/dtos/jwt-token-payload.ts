import { Roles } from "ente-types";

export interface JwtTokenPayload {
  id: string;
  username: string;
  displayname: string;
  role: Roles;
  isAdmin: boolean;
  childrenIds: string[];
}
