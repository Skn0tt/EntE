import {
  CreateEntryDto,
  CreateUserDto,
  PatchUserDto,
  CreateSlotDto
} from "./dtos";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";

type Class<T> = { new (...args: any[]): T };

const validateDto = <T>(
  _class: Class<T>,
  additional: (v: T) => boolean = () => true
) => (value: T) => {
  const c = value instanceof _class ? value : plainToClass(_class, value);
  const errors = validateSync(c);
  console.log(errors);
  return errors.length === 0 && additional(c);
};

export const isValidCreateEntryDto = validateDto(CreateEntryDto);
export const isValidCreateUserDto = validateDto(CreateUserDto);
export const isValidPatchUserDto = validateDto(PatchUserDto);
export const isValidCreateSlotDto = validateDto(CreateSlotDto);
