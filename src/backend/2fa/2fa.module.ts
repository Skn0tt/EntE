import { Module } from "@nestjs/common";
import { DbModule } from "../db/db.module";
import { TwoFAService } from "./2fa.service";
import { TwoFAController } from "./2fa.controller";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [DbModule, EmailModule],
  providers: [TwoFAService],
  controllers: [TwoFAController],
})
export class TwoFAModule {}
