import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException
} from "@nestjs/common";
import { StatusService } from "./status.service";

@Controller("status")
export class StatusController {
  constructor(
    @Inject(StatusService) private readonly statusService: StatusService
  ) {}

  @Get()
  async status() {
    const status = await this.statusService.getStatus();
    if (!status.isHealthy) {
      throw new ServiceUnavailableException(status);
    }
    return status;
  }
}
