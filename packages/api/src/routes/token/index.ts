/**
 * Express
 */
import { Router } from "express";

/**
 * EntE
 */
import { MongoId, Roles, JWT_PAYLOAD } from "ente-types";

/**
 * Helpers
 */
import * as JWT from "jsonwebtoken";
import { getFirstSecret } from "../../authentication/strategies/jwt";
import wrapAsync from "../../helpers/wrapAsync";

/**
 * Token Router
 * '/token'
 *
 * Authenticated
 */
const tokenRouter = Router();

tokenRouter.get(
  "/",
  wrapAsync(async (req, res) => {
    const secret = await getFirstSecret();

    const payload: JWT_PAYLOAD = {
      username: req.user.username,
      displayname: req.user.displayname,
      role: req.user.role,
      children: req.user.children
    };

    const token = JWT.sign(payload, secret, {
      expiresIn: 60 * 15
    });

    return res.status(200).send(token);
  })
);

export default tokenRouter;
