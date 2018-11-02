import { Injectable } from "@nestjs/common";
import * as redis from "redis";
import { Maybe, Some, None } from "monet";
import { Config } from "../helpers/config";

@Injectable()
export class RedisService {
  private readonly client: redis.RedisClient;
  private readonly prefix: string;

  constructor() {
    const { host, port, prefix } = Config.getRedisConfig();
    this.client = redis.createClient({ host, port });
    this.prefix = prefix;
  }

  set = (key: string, value: string) =>
    new Promise((resolve, reject) => {
      this.client.set(this.prefixedKey(key), value, err => {
        if (!!err) {
          reject(err);
        }
        resolve();
      });
    });

  setWithExpiry = (key: string, value: string, expiryInMilliSeconds: number) =>
    new Promise((resolve, reject) => {
      this.client.set(
        this.prefixedKey(key),
        value,
        "PX",
        expiryInMilliSeconds,
        err => {
          if (!!err) {
            reject(err);
          }
          resolve();
        }
      );
    });

  get = (key: string) =>
    new Promise<Maybe<string>>((resolve, reject) => {
      this.client.get(this.prefixedKey(key), (err, result) => {
        if (!!err) {
          reject(err);
        }
        resolve(!!result ? Some(result) : None());
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

  async isHealthy(): Promise<boolean> {
    return true;
    throw new Error("Not Implemented");
  }

  private prefixedKey = (key: string) => this.prefix + key;
}
