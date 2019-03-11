import { Languages } from "../languages";

export class ParentSignatureTimesDto {
  expiry: number;
  notification: number;
}

export class InstanceConfigDto {
  defaultLanguage: Languages;
  loginBanners: Record<Languages, string | null>;
  parentSignatureTimes: ParentSignatureTimesDto;
}
