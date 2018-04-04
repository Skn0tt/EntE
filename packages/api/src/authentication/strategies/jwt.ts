import * as redis from "redis";
import * as crypto from "crypto";
import * as JWT from "jsonwebtoken";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { promisify } from "util";
import User from "../../models/User";
import { redis as redisTypes, JWT_PAYLOAD } from "ente-types";

const client = redis.createClient("redis://redis");

const get = promisify(client.get).bind(client);

export const getSecrets = async (): Promise<[string, string]> =>
  JSON.parse(await get(redisTypes.JWT_SECRETS));

export const getFirstSecret = async () => (await getSecrets())[0];

const validate = async (token: string): Promise<JWT_PAYLOAD> => {
  try {
    // Get Secrets
    const [currentSecret, oldSecret] = await getSecrets();

    try {
      // current secret
      const payload = JWT.verify(token, currentSecret) as JWT_PAYLOAD;
      return payload;
    } catch (error) {
      try {
        // old secret
        const oldPayload = JWT.verify(token, oldSecret) as JWT_PAYLOAD;
        return oldPayload;
      } catch (error) {
        // both are wrong
        return null;
      }
    }
  } catch (error) {
    throw error;
  }
};

const jwtStrategy = new BearerStrategy(async (token, done) => {
  try {
    const payload = await validate(token);
    if (!payload) {
      return done(null, false);
    }

    const user = await User.findOne({
      username: payload.username,
      role: payload.role
    });
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

export default jwtStrategy;
