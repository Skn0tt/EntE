import { IsBoolean, IsOptional } from "class-validator";

export class PatchEntryDto {
  @IsOptional()
  @IsBoolean()
  signed?: boolean;
}
