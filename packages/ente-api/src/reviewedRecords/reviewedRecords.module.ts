import { Module } from "@nestjs/common";
import { ReviewedRecordsController } from "./reviewedRecords.controller";
import { ReviewedRecordsService } from "./reviewedRecords.service";
import { DbModule } from "../db/db.module";

@Module({
  imports: [DbModule],
  providers: [ReviewedRecordsService],
  controllers: [ReviewedRecordsController],
  exports: [ReviewedRecordsService]
})
export class ReviewedRecordsModule {}
