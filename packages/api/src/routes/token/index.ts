import { Router } from "express";
import * as JWT from "jsonwebtoken";
import User from "../../models/User";
import { getSecrets } from "../../authentication/strategies/jwt";
import { MongoId, Roles } from "ente-types";

export type JWT_PAYLOAD = {
  username: string;
  displayname: string;
  role: Roles;
  children: MongoId[];
};

const tokenRouter = Router();

tokenRouter.get("/", async (r, w, n) => {
  try {
    const secret = (await getSecrets())[0];
    const payload: JWT_PAYLOAD = {
      username: r.user.username,
      displayname: r.user.displayname,
      role: r.user.role,
      children: r.user.children
    };

    const token = JWT.sign(payload, secret, {
      expiresIn: 60 * 15
    });

    return w
      .status(200)
      .json(token)
      .end();
  } catch (error) {
    return n(error);
  }
});

export default tokenRouter;
