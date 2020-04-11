import {
  Controller,
  UseGuards,
  Get,
  Inject,
  NotFoundException,
  Param,
  Put,
  ForbiddenException,
  BadRequestException,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  InstanceConfigService,
  SetInstanceConfigValueFail,
} from "./instance-config.service";
import { InstanceConfigDto, Languages, isValidLanguage } from "ente-types";
import { Ctx, RequestContext } from "../helpers/request-context";
import { Request } from "express";

@Controller("instanceConfig")
export class InstanceConfigController {
  constructor(
    @Inject(InstanceConfigService)
    private readonly instanceConfigService: InstanceConfigService
  ) {}

  @Get()
  async getInstanceConfig(): Promise<InstanceConfigDto> {
    return await this.instanceConfigService.getInstanceConfig();
  }

  @Get("entryCreationDeadline")
  async getEntryCreationDeadline(): Promise<number> {
    return await this.instanceConfigService.getEntryCreationDeadline();
  }

  @Put("entryCreationDeadline")
  @UseGuards(AuthGuard("combined"))
  async setEntryCreationDeadline(
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ): Promise<void> {
    const days = +req.body;
    const result = await this.instanceConfigService.setEntryCreationDeadline(
      days,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
          case SetInstanceConfigValueFail.IllegalValue:
            throw new BadRequestException();
        }
      },
      () => {}
    );
  }

  @Get("loginBanners")
  async getLoginBanners(): Promise<Record<Languages, string | null>> {
    return await this.instanceConfigService.getLoginBanners();
  }

  @Get("loginBanners/:lang")
  async getLoginBanner(
    @Param("lang") lang: string
  ): Promise<string | undefined> {
    if (!isValidLanguage(lang)) {
      throw new NotFoundException();
    }

    const value = await this.instanceConfigService.getLoginBannerForLanguage(
      lang
    );
    return value.orUndefined();
  }

  @Get("parentSignatureTimes")
  async getParentSignatureTimes() {
    return await this.instanceConfigService.getParentSignatureTimes();
  }

  @Get("parentSignatureTimes/expiry")
  async getParentSignatureExpiryTime() {
    return await this.instanceConfigService.getParentSignatureExpiryTime();
  }

  @Get("parentSignatureTimes/notification")
  async getParentSignatureNotificationTime() {
    return await this.instanceConfigService.getParentSignatureNotificationTime();
  }

  @Put("parentSignatureTimes/expiry")
  @UseGuards(AuthGuard("combined"))
  async setParentSignatureExpiryTime(
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ) {
    const value = +req.body;
    if (isNaN(value)) {
      throw new BadRequestException("Number expected");
    }
    const result = await this.instanceConfigService.setParentSignatureExpiryTime(
      value,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      () => {}
    );
  }

  @Put("parentSignatureTimes/notification")
  @UseGuards(AuthGuard("combined"))
  async setParentSignatureNotificationTime(
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ) {
    const value = +req.body;
    const result = await this.instanceConfigService.setParentSignatureNotificationTime(
      value,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
          case SetInstanceConfigValueFail.IllegalValue:
            throw new BadRequestException();
        }
      },
      () => {}
    );
  }

  @Put("loginBanners/:lang")
  @UseGuards(AuthGuard("combined"))
  async setLoginBanner(
    @Param("lang") lang: string,
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ): Promise<void> {
    const bannerText = req.body as string;

    if (!isValidLanguage(lang)) {
      throw new NotFoundException();
    }

    const result = await this.instanceConfigService.setLoginBanner(
      lang,
      bannerText === "" ? null : bannerText,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
          case SetInstanceConfigValueFail.IllegalValue:
            throw new BadRequestException();
        }
      },
      () => {}
    );
  }

  @Get("defaultLanguage")
  async getDefaultLanguage(): Promise<Languages> {
    return await this.instanceConfigService.getDefaultLanguage();
  }

  @Put("defaultLanguage")
  @UseGuards(AuthGuard("combined"))
  async setDefaultLanguage(
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ): Promise<void> {
    const lang = req.body as string;
    if (!isValidLanguage(lang)) {
      throw new BadRequestException();
    }

    const result = await this.instanceConfigService.setDefaultLanguage(
      lang,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      () => {}
    );
  }
}
