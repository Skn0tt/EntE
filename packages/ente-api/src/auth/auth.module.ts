import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PasswordResetTokenService } from "./password-token.service";
import { RedisService } from "../infrastructure/redis.service";
import { SignerService } from "../infrastructure/signer.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { DbModule } from "../db/db.module";
import { BasicStrategy } from "./basic.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { CombinedStrategy } from "./combined.strategy";

@Module({
  imports: [DbModule, InfrastructureModule],
  providers: [
    AuthService,
    PasswordResetTokenService,
    RedisService,
    SignerService,
    BasicStrategy,
    JwtStrategy,
    CombinedStrategy
  ],
  exports: [PasswordResetTokenService]
})
export class AuthModule {}
