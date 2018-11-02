import { Module } from "@nestjs/common";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";

@Module({
  imports: [InfrastructureModule],
  providers: [TokenService],
  controllers: [TokenController]
})
export class TokenModule {}
