import { IsBoolean, IsOptional } from "class-validator";

export class PatchEntryDto {
  @IsOptional()
  @IsBoolean()
  forSchool?: boolean;

  @IsOptional()
  @IsBoolean()
  signed?: boolean;
}
