import { Router } from "express";
import * as JWT from 'jsonwebtoken';
import User from "../../models/User";

const jwtSecret = process.env.JWT_SECRET || 'supersecret';

const tokenRouter = Router();

tokenRouter.get('/', async (r, w, n) => {
  try {
    const payload = {
      username: r.user.username,
      displayname: r.user.displayname,
      role: r.user.role,
      children: r.user.children,
    };

    const token = JWT.sign(payload, jwtSecret, {
      expiresIn: 60 * 15,
    });
    
    return w.status(200).json(token).end();
  } catch (error) {
    return n(error);
  }
});

export default tokenRouter;
