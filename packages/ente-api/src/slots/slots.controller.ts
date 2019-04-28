import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
  Inject,
  UseGuards
} from "@nestjs/common";
import { RequestContext, Ctx } from "../helpers/request-context";
import { SlotsService, FindOneSlotFailure } from "./slots.service";
import { AuthGuard } from "@nestjs/passport";
import {
  PaginationInfo,
  PaginationInformation
} from "../helpers/pagination-info";
import { BlackedSlotDto } from "ente-types";

@Controller("slots")
@UseGuards(AuthGuard("combined"))
export class SlotsController {
  constructor(
    @Inject(SlotsService) private readonly slotsService: SlotsService
  ) {}

  @Get()
  async findAll(
    @Ctx() ctx: RequestContext,
    @PaginationInfo() pInfo: PaginationInformation
  ): Promise<BlackedSlotDto[]> {
    return await this.slotsService.findAll(ctx.user, pInfo);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<BlackedSlotDto> {
    const result = await this.slotsService.findOne(id, ctx.user);
    return result.cata(
      fail => {
        switch (fail) {
          case FindOneSlotFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case FindOneSlotFailure.SlotNotFound:
            throw new NotFoundException();
          default:
            throw new ForbiddenException();
        }
      },
      slot => slot
    );
  }
}
