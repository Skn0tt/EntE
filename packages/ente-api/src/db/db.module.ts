import { Module } from "@nestjs/common";
import { EntryRepo } from "./entry.repo";
import { UserRepo } from "./user.repo";
import { SlotRepo, PrefiledSlotRepo } from "./slot.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Slot } from "./slot.entity";
import { Entry } from "./entry.entity";
import { KeyValueStore } from "./keyvaluestore.entity";
import { KeyValueStoreRepo } from "./keyvaluestore.repo";
import { DbHealthIndicator } from "./db-health-indicator";
import { RecordReviewalRepo } from "./recordReviewal.repo";
import { RecordReviewal } from "./recordReviewal.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Slot, Entry, KeyValueStore, RecordReviewal])
  ],
  providers: [
    EntryRepo,
    UserRepo,
    SlotRepo,
    PrefiledSlotRepo,
    KeyValueStoreRepo,
    DbHealthIndicator,
    RecordReviewalRepo
  ],
  exports: [
    EntryRepo,
    UserRepo,
    SlotRepo,
    PrefiledSlotRepo,
    KeyValueStoreRepo,
    DbHealthIndicator,
    RecordReviewalRepo
  ]
})
export class DbModule {}
