import { Module } from "@nestjs/common";
import { DevController } from "./dev.controller";
import { SlotsModule } from "../slots/slots.module";

@Module({
  imports: [SlotsModule],
  controllers: [DevController]
})
export class DevModule {}
