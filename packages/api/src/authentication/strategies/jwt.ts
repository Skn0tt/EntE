import * as redis from "redis";
import * as JWT from "jsonwebtoken";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import { promisify } from "util";
import { redis as redisTypes, JWT_PAYLOAD } from "ente-types";
import { User } from "ente-db";

const client = redis.createClient("redis://redis");

const redisGet = promisify(client.get).bind(client);

export const getSecrets = async (): Promise<[string, string]> =>
  JSON.parse(await redisGet(redisTypes.JWT_SECRETS));

export const getFirstSecret = async () => (await getSecrets())[0];

const validate = async (token: string): Promise<JWT_PAYLOAD | null> => {
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

    const { username, role } = payload;
    const user = await User.findByRoleAndUsername(role, username);

    return done(null, user || false);
  } catch (error) {
    return done(error, false);
  }
});

export default jwtStrategy;
