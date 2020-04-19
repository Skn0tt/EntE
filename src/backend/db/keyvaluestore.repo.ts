import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { KeyValueStore } from "./keyvaluestore.entity";
import { Maybe, Some, None } from "monet";
import * as _ from "lodash";

@Injectable()
export class KeyValueStoreRepo {
  constructor(
    @InjectRepository(KeyValueStore)
    private readonly repo: Repository<KeyValueStore>
  ) {}

  public async has(key: string): Promise<boolean> {
    const count = await this.repo.count({ where: { key } });
    return count > 0;
  }

  public async set(key: string, value: string) {
    const keyExists = await this.has(key);
    if (keyExists) {
      await this.repo.update(key, { value });
    } else {
      await this.repo.insert({ key, value });
    }
  }

  public async remove(key: string) {
    await this.repo.delete(key);
  }

  public async setIfNotExists(key: string, value: string) {
    const keyExists = await this.has(key);
    if (!keyExists) {
      await this.repo.insert({ key, value });
    }
  }

  public async get<T extends string = string>(key: string): Promise<Maybe<T>> {
    const value = await this.repo.findOne({ key });
    return Maybe.fromUndefined(value).flatMap((kv) =>
      Maybe.fromNull<T>(kv.value as T | null)
    );
  }

  public async getMultiple<T extends string>(
    ...keys: T[]
  ): Promise<Record<T, Maybe<string>>> {
    const items = await this.repo.find({ key: In(keys) });

    return _.defaults(
      _.fromPairs(
        items.map((item) => [item.key, Some<string>(item.value)])
      ) as Record<T, Maybe<string>>,
      _.fromPairs(keys.map((key) => [key, None<string>()]))
    );
  }
}
