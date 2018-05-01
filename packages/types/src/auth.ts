import { Roles, UserId } from "./types";

export type JWT_PAYLOAD = {
  username: string;
  displayname: string;
  role: Roles;
  children: UserId[];
};
