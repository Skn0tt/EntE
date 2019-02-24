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
  Req
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  InstanceConfigService,
  SetInstanceConfigValueFail
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

  @Put("loginBanners/:lang")
  @UseGuards(AuthGuard("combined"))
  async setLoginBanner(
    @Param("lang") lang: string,
    @Req() req: Request,
    @Ctx() ctx: RequestContext
  ): Promise<void> {
    const bannerText = (await req.body) as string;

    if (!isValidLanguage(lang)) {
      throw new NotFoundException();
    }

    const result = await this.instanceConfigService.setLoginBanner(
      lang,
      bannerText === "" ? null : bannerText,
      ctx.user
    );
    return result.cata(
      fail => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
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
    const lang = (await req.body) as string;
    if (!isValidLanguage(lang)) {
      throw new BadRequestException();
    }

    const result = await this.instanceConfigService.setDefaultLanguage(
      lang,
      ctx.user
    );
    return result.cata(
      fail => {
        switch (fail) {
          case SetInstanceConfigValueFail.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      () => {}
    );
  }
}
