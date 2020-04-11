import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
  Inject,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  Delete,
} from "@nestjs/common";
import { RequestContext, Ctx } from "../helpers/request-context";
import {
  SlotsService,
  FindOneSlotFailure,
  CreatePrefiledSlotsFailure,
  DeletePrefiledSlotsFailure,
} from "./slots.service";
import { AuthGuard } from "@nestjs/passport";
import {
  PaginationInfo,
  PaginationInformation,
} from "../helpers/pagination-info";
import { BlackedSlotDto, CreatePrefiledSlotsDto } from "ente-types";
import { ValidationPipe } from "../helpers/validation.pipe";

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
      (fail) => {
        switch (fail) {
          case FindOneSlotFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case FindOneSlotFailure.SlotNotFound:
            throw new NotFoundException();
          default:
            throw new ForbiddenException();
        }
      },
      (slot) => slot
    );
  }

  @Post("/prefiled")
  async createPrefiled(
    @Body(new ValidationPipe({ array: false, type: CreatePrefiledSlotsDto }))
    slots: CreatePrefiledSlotsDto,
    @Ctx() ctx: RequestContext
  ): Promise<BlackedSlotDto[]> {
    const result = await this.slotsService.createPrefiled(slots, ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case CreatePrefiledSlotsFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case CreatePrefiledSlotsFailure.InvalidDto:
            throw new BadRequestException();
        }
      },
      (slots) => slots
    );
  }

  @Delete(":id")
  async deletePrefiled(@Param("id") id: string, @Ctx() ctx: RequestContext) {
    const result = await this.slotsService.deletePrefiled(id, ctx.user);
    result.forEachFail((fail) => {
      switch (fail) {
        case DeletePrefiledSlotsFailure.SlotIsNotPrefiled:
        case DeletePrefiledSlotsFailure.ForbiddenForUser:
          throw new ForbiddenException();
        case DeletePrefiledSlotsFailure.NotFound:
          throw new NotFoundException();
      }
    });
  }
}
