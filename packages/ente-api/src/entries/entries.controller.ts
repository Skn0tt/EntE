import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Body,
  NotFoundException,
  ForbiddenException,
  Inject,
  UseGuards,
  BadRequestException,
  Delete
} from "@nestjs/common";
import { RequestContext, Ctx } from "../helpers/request-context";
import {
  EntriesService,
  FindEntryFailure,
  CreateEntryFailure,
  FindAllEntriesFailure,
  DeleteEntryFailure,
  PatchEntryFailure
} from "./entries.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateEntryDto, EntryDto, PatchEntryDto } from "ente-types";
import { ValidationPipe } from "../helpers/validation.pipe";
import {
  PaginationInfo,
  PaginationInformation
} from "../helpers/pagination-info";

@Controller("entries")
@UseGuards(AuthGuard("combined"))
export class EntriesController {
  constructor(
    @Inject(EntriesService) private readonly entriesService: EntriesService
  ) {}

  @Get()
  async findAll(
    @Ctx() ctx: RequestContext,
    @PaginationInfo() pInfo: PaginationInformation
  ): Promise<EntryDto[]> {
    const entry = await this.entriesService.findAll(ctx.user, pInfo);
    return entry.cata(
      fail => {
        switch (fail) {
          case FindAllEntriesFailure.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      e => e
    );
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Ctx() ctx: RequestContext) {
    const result = await this.entriesService.findOne(id, ctx.user);
    return result.cata(
      fail => {
        switch (fail) {
          case FindEntryFailure.EntryNotFound:
            throw new NotFoundException();
          case FindEntryFailure.ForbiddenForUser:
            throw new ForbiddenException();
          default:
            throw new ForbiddenException();
        }
      },
      entry => entry
    );
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ array: false, type: CreateEntryDto }))
    entry: CreateEntryDto,
    @Ctx() ctx: RequestContext
  ): Promise<EntryDto> {
    const result = await this.entriesService.create(entry, ctx.user);
    return result.cata(
      fail => {
        switch (fail) {
          case CreateEntryFailure.StudentIdMissing:
            throw new BadRequestException("StudentId Missing");
          case CreateEntryFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case CreateEntryFailure.StudentNotFound:
            throw new BadRequestException("Student not found");
          case CreateEntryFailure.TeacherUnknown:
            throw new BadRequestException("Teacher not found");
          default:
            throw new ForbiddenException();
        }
      },
      entry => entry
    );
  }

  @Patch(":id")
  async patch(
    @Param("id") id: string,
    @Body(new ValidationPipe({ array: false, type: PatchEntryDto }))
    value: PatchEntryDto,
    @Ctx() ctx: RequestContext
  ) {
    const result = await this.entriesService.patch(id, value, ctx.user);
    return result.cata(
      fail => {
        switch (fail) {
          case PatchEntryFailure.NotFound:
            throw new NotFoundException();
          case PatchEntryFailure.ForbiddenForRole:
            throw new ForbiddenException();
          case PatchEntryFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case PatchEntryFailure.IllegalPatch:
            throw new BadRequestException();
          case PatchEntryFailure.EntryAlreadyExpired:
            throw new BadRequestException("Entry already expired");
          default:
            throw new ForbiddenException();
        }
      },
      entry => entry
    );
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Ctx() ctx: RequestContext) {
    const result = await this.entriesService.delete(id, ctx.user);
    return result.cata(
      fail => {
        switch (fail) {
          case DeleteEntryFailure.NotFound:
            throw new NotFoundException();
          case DeleteEntryFailure.ForbiddenForRole:
          case DeleteEntryFailure.ForbiddenForUser:
            throw new ForbiddenException();
          default:
            throw new BadRequestException();
        }
      },
      entry => entry
    );
  }
}
