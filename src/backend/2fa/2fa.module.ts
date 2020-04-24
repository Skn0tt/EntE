import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { TwoFAService } from "./2fa.service";
import { TwoFAController } from "./2fa.controller";

@Module({
  imports: [DbModule],
  providers: [TwoFAService],
  controllers: [TwoFAController],
})
export class TwoFAModule {}
