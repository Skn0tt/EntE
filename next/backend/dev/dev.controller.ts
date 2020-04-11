import { Controller, Inject, Post } from "@nestjs/common";
import { SlotsService } from "../slots/slots.service";

@Controller("dev")
export class DevController {
  constructor(
    @Inject(SlotsService) private readonly slotService: SlotsService
  ) {}

  @Post("/weeklySummary")
  async dispatchWeeklySummary() {
    await this.slotService.dispatchWeeklySummary();
  }
}
