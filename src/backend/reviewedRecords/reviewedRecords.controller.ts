import {
  Controller,
  Inject,
  UseGuards,
  Get,
  Post,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ReviewedRecordsService } from "./reviewedRecords.service";
import { Ctx, RequestContext } from "../helpers/request-context";
import { isValidUuid } from "@@types";

@Controller("reviewedRecords")
@UseGuards(AuthGuard("combined"))
export class ReviewedRecordsController {
  constructor(
    @Inject(ReviewedRecordsService)
    private readonly reviewedRecordsService: ReviewedRecordsService
  ) {}

  @Get()
  async findAll(@Ctx() ctx: RequestContext): Promise<string[]> {
    const result = await this.reviewedRecordsService.getReviewedRecords(
      ctx.user.id
    );
    return [...result];
  }

  @Post()
  async add(
    @Body()
    entryId: string,
    @Ctx() ctx: RequestContext
  ) {
    if (!isValidUuid(entryId)) {
      throw new BadRequestException();
    }

    await this.reviewedRecordsService.addToReviewedRecords(
      ctx.user.id,
      entryId
    );
  }
}
