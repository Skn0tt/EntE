import { Module } from "@nestjs/common";
import { EntriesService } from "./entries.service";
import { EntriesController } from "./entries.controller";
import { EmailModule } from "../email/email.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [DbModule, EmailModule],
  providers: [EntriesService],
  controllers: [EntriesController],
  exports: [EntriesService]
})
export class EntriesModule {}
