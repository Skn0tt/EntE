import { Injectable } from "@nestjs/common";
import * as redis from "redis";
import { Maybe, Some, None } from "monet";
import { Config } from "../helpers/config";
import * as _ from "lodash";

@Injectable()
export class RedisService {
  private readonly client: redis.RedisClient;
  private readonly prefix: string;

  constructor() {
    const { host, port, prefix } = Config.getRedisConfig();
    this.client = redis.createClient({ host, port });
    this.prefix = prefix;
  }

  public getClient() {
    return this.client;
  }

  removeFromSet = (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      this.client.srem(this.prefixedKey(key), value, (err) => {
        if (!!err) {
          reject(err);
        }
        resolve();
      });
    });

  addToSet = (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      this.client.sadd(this.prefixedKey(key), value, (err) => {
        if (!!err) {
          reject(err);
        }
        resolve();
      });
    });

  getAllFromSet = (key: string) =>
    new Promise<Maybe<Set<string>>>((resolve, reject) => {
      this.client.smembers(this.prefixedKey(key), (err, result) => {
        if (!!err) {
          reject(err);
        }

        resolve(Maybe.fromFalsy(result).map((values) => new Set(values)));
      });
    });

  keys = (keyPattern: string) =>
    new Promise<Set<string>>((resolve, reject) => {
      this.client.keys(this.prefixedKey(keyPattern), (err, result) => {
        if (!!err) {
          reject(err);
        }
        resolve(new Set(result));
      });
    });

  set = (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      this.client.set(this.prefixedKey(key), value, (err) => {
        if (!!err) {
          reject(err);
        }
        resolve();
      });
    });

  setWithExpiry = (key: string, value: string, expiryInMilliSeconds: number) =>
    new Promise<void>((resolve, reject) => {
      this.client.set(
        this.prefixedKey(key),
        value,
        "PX",
        expiryInMilliSeconds,
        (err) => {
          if (!!err) {
            reject(err);
          }
          resolve();
        }
      );
    });

  setIfNotExists = (key: string, value: string) =>
    new Promise<void>((resolve, reject) => {
      this.client.setnx(this.prefixedKey(key), value, (err) => {
        if (!!err) {
          reject(err);
        }
        resolve();
      });
    });

  get = <T extends string>(key: string) =>
    new Promise<Maybe<T>>((resolve, reject) => {
      this.client.get(this.prefixedKey(key), (err, result) => {
        if (!!err) {
          reject(err);
        }
        resolve(!!result ? Some(result as T) : None());
      });
    });

  getMultiple = <T extends string>(...keys: T[]) =>
    new Promise<Record<T, string | null>>((resolve, reject) => {
      this.client.mget(...keys.map(this.prefixedKey), (error, values) => {
        if (!!error) {
          return reject(error);
        }

        const result: Record<T, string | null> = _.zipObject(
          keys,
          values
        ) as any;
        return resolve(result);
      });
    });

  remove = (...keys: string[]) =>
    new Promise<boolean>((resolve, reject) => {
      this.client.del(keys.map(this.prefixedKey), (err, nrDeleted) => {
        if (!!err) {
          reject(err);
        }
        resolve(nrDeleted === keys.length ? true : false);
      });
    });

  isHealthy = () =>
    new Promise<boolean>((resolve) => {
      let finished = false;

      setTimeout(() => {
        if (!finished) {
          finished = true;
          resolve(false);
        }
      }, 1000);

      this.client.ping((err) => {
        if (!finished) {
          const isHealthy = !err;
          finished = true;
          resolve(isHealthy);
        }
      });
    });

  private prefixedKey = (key: string) => this.prefix + key;
}
