import { KeyValueStoreRepo } from "backend/db/keyvaluestore.repo";
import { Injectable, Inject } from "@nestjs/common";

@Injectable()
export class UIStateService {
  constructor(
    @Inject(KeyValueStoreRepo) private readonly kvRepo: KeyValueStoreRepo
  ) {}

  private static key(uid: string) {
    return `uistate:${uid}`;
  }

  async get(uid: string): Promise<string> {
    const result = await this.kvRepo.get(UIStateService.key(uid));
    return result.orSome("");
  }

  async set(uid: string, state: string): Promise<void> {
    await this.kvRepo.set(UIStateService.key(uid), state);
  }
}
