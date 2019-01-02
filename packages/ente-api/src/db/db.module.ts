import { Module } from "@nestjs/common";
import { EntryRepo } from "./entry.repo";
import { UserRepo } from "./user.repo";
import { SlotRepo } from "./slot.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Slot } from "./slot.entity";
import { Entry } from "./entry.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Slot, Entry])],
  providers: [EntryRepo, UserRepo, SlotRepo],
  exports: [EntryRepo, UserRepo, SlotRepo]
})
export class DbModule {}
