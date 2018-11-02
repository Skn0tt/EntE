import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { UserDto } from "ente-types";

export type RequestContext<T = {}> = T & {
  user: UserDto;
};

export const Ctx = createParamDecorator((_, req: Request): RequestContext => {
  const user = req.user as UserDto;
  return { user };
});
