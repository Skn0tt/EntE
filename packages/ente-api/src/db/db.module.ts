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

@Module({
  imports: [TypeOrmModule.forFeature([User, Slot, Entry, KeyValueStore])],
  providers: [EntryRepo, UserRepo, SlotRepo, KeyValueStoreRepo],
  exports: [EntryRepo, UserRepo, SlotRepo, KeyValueStoreRepo]
})
export class DbModule {}
