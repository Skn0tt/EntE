import { Roles, MongoId } from "./types";

export type JWT_PAYLOAD = {
  username: string;
  displayname: string;
  role: Roles;
  children: MongoId[];
};
