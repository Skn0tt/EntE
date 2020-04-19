import { Module } from "@nestjs/common";
import { ExportController } from "./export.controller";
import { ExportService } from "./export.service";
import { DbModule } from "../db/db.module";

@Module({
  controllers: [ExportController],
  providers: [ExportService],
  imports: [DbModule],
})
export class ExportModule {}
