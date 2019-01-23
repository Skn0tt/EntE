import { Languages } from "../languages";

export class InstanceConfigDto {
  defaultLanguage: Languages;
  loginBanners: Record<Languages, string | null>;
}
