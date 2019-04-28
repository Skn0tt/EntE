import { Module } from "@nestjs/common";
import { EntryRepo } from "./entry.repo";
import { UserRepo } from "./user.repo";
import { SlotRepo } from "./slot.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Slot } from "./slot.entity";
import { Entry } from "./entry.entity";
import { KeyValueStore } from "./keyvaluestore.entity";
import { KeyValueStoreRepo } from "./keyvaluestore.repo";
import { DbHealthIndicator } from "./db-health-indicator";

@Module({
  imports: [TypeOrmModule.forFeature([User, Slot, Entry, KeyValueStore])],
  providers: [
    EntryRepo,
    UserRepo,
    SlotRepo,
    KeyValueStoreRepo,
    DbHealthIndicator
  ],
  exports: [EntryRepo, UserRepo, SlotRepo, KeyValueStoreRepo, DbHealthIndicator]
})
export class DbModule {}
