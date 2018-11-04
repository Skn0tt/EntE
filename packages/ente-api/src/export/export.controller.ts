import {
  Controller,
  Get,
  UseGuards,
  Inject,
  ForbiddenException,
  Header,
  Res
} from "@nestjs/common";
import { Ctx, RequestContext } from "../helpers/request-context";
import { AuthGuard } from "@nestjs/passport";
import { ExportService, ExportExcelFailure } from "./export.service";
import { Response } from "express";

@Controller("export")
@UseGuards(AuthGuard("combined"))
export class ExportController {
  constructor(
    @Inject(ExportService) private readonly exportService: ExportService
  ) {}

  @Get("excel")
  @Header("Content-Disposition", "attachment; filename=export.xlsx")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  async getExcelExport(@Ctx() ctx: RequestContext, @Res() res: Response) {
    const result = await this.exportService.getExcelExport(ctx.user);

    return result.cata(
      fail => {
        switch (fail) {
          case ExportExcelFailure.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      b => {
        res.send(b);
        res.end();
      }
    );
  }
}
