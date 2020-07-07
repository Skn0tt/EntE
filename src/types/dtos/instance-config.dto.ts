import { Languages } from "../languages";

export class ParentSignatureTimesDto {
  expiry: number;
  notification: number;
}

export class InstanceConfigDto {
  defaultLanguage: Languages;
  loginBanners: Record<Languages, string | null>;
  parentSignatureTimes: ParentSignatureTimesDto;
  entryCreationDeadline: number;
  isWeeklySummaryDisabled: boolean;
}

export const DEFAULT_ENTRY_CREATION_DEADLINE = 14;
