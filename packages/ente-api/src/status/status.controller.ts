import {
  Controller,
  ConflictException,
  Get,
  Inject,
  UseInterceptors
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
    return status.cata(
      errors => {
        throw new ConflictException(errors);
      },
      () => {}
    );
  }
}
