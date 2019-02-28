import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import {
  InstanceConfigDto,
  Languages,
  languagesArr,
  DEFAULT_LANGUAGE,
  Roles
} from "ente-types";
import * as _ from "lodash";
import { Maybe, Validation, Success, Fail } from "monet";
import { RequestContextUser } from "../helpers/request-context";
import { KeyValueStoreRepo } from "../db/keyvaluestore.repo";

export enum SetInstanceConfigValueFail {
  ForbiddenForRole
}

const INSTANCE_CONFIG_REDIS_KEYS = {
  DEFAULT_LANGUAGE: "INSTANCE_CONFIG__DEFAULT_LANGUAGE",
  LOGIN_BANNER: (l: Languages) => "INSTANCE_CONFIG__LOGIN_BANNER_" + l
};

@Injectable()
export class InstanceConfigService implements OnModuleInit {
  constructor(
    @Inject(KeyValueStoreRepo)
    private readonly keyValueStoreRepo: KeyValueStoreRepo
  ) {}

  async onModuleInit() {
    await this.keyValueStoreRepo.setIfNotExists(
      INSTANCE_CONFIG_REDIS_KEYS.DEFAULT_LANGUAGE,
      DEFAULT_LANGUAGE
    );
  }

  async getInstanceConfig(): Promise<InstanceConfigDto> {
    const values = await this.keyValueStoreRepo.getMultiple(
      INSTANCE_CONFIG_REDIS_KEYS.DEFAULT_LANGUAGE,
      ...languagesArr.map(INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER)
    );

    const loginBanners = _.fromPairs(
      languagesArr.map(language => {
        const value = values[INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER(language)];
        return [language, value.orNull()] as [Languages, string | null];
      })
    ) as Record<Languages, string | null>;

    const defaultLanguage = (values[
      INSTANCE_CONFIG_REDIS_KEYS.DEFAULT_LANGUAGE
    ] as Maybe<Languages>).orSome(DEFAULT_LANGUAGE);

    return {
      defaultLanguage,
      loginBanners
    };
  }

  async getLoginBanners(): Promise<Record<Languages, string | null>> {
    const values = await this.keyValueStoreRepo.getMultiple(
      ...languagesArr.map(INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER)
    );

    const loginBanners = _.fromPairs(
      languagesArr.map(language => {
        const value = values[INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER(language)];
        return [language, value.orNull()] as [Languages, string | null];
      })
    ) as Record<Languages, string | null>;

    return loginBanners;
  }

  async getLoginBannerForLanguage(lang: Languages): Promise<Maybe<string>> {
    const key = INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER(lang);
    return await this.keyValueStoreRepo.get(key);
  }

  async getDefaultLanguage(): Promise<Languages> {
    const value = await this.keyValueStoreRepo.get<Languages>(
      INSTANCE_CONFIG_REDIS_KEYS.DEFAULT_LANGUAGE
    );
    return value.orSome(DEFAULT_LANGUAGE);
  }

  async setDefaultLanguage(
    lang: Languages,
    user: RequestContextUser
  ): Promise<Validation<SetInstanceConfigValueFail, true>> {
    if (user.role !== Roles.ADMIN) {
      return Fail(SetInstanceConfigValueFail.ForbiddenForRole);
    }

    await this.keyValueStoreRepo.set(
      INSTANCE_CONFIG_REDIS_KEYS.DEFAULT_LANGUAGE,
      lang
    );
    return Success<SetInstanceConfigValueFail, true>(true);
  }

  async setLoginBanner(
    lang: Languages,
    bannerText: string | null,
    user: RequestContextUser
  ): Promise<Validation<SetInstanceConfigValueFail, true>> {
    if (user.role !== Roles.ADMIN) {
      return Fail(SetInstanceConfigValueFail.ForbiddenForRole);
    }

    const key = INSTANCE_CONFIG_REDIS_KEYS.LOGIN_BANNER(lang);
    if (_.isNull(bannerText)) {
      await this.keyValueStoreRepo.remove(key);
    } else {
      await this.keyValueStoreRepo.set(key, bannerText);
    }

    return Success<SetInstanceConfigValueFail, true>(true);
  }
}
