import {
  CreateEntryDto,
  CreateUserDto,
  PatchUserDto,
  CreateSlotDto
} from "./dtos";
import { plainToClass } from "class-transformer";
import { validateSync, ValidationError } from "class-validator";
import { Validation, Success, Fail } from "monet";

type Class<T> = { new (...args: any[]): T };

const validateDtoWithErrors = <T>(
  _class: Class<T>,
  additional: (v: T) => boolean = () => true
) => (value: T): Validation<ValidationError[], boolean> => {
  const c = value instanceof _class ? value : plainToClass(_class, value);
  const errors = validateSync(c);
  return errors.length === 0 && additional(c) ? Success(true) : Fail(errors);
};

const validateDto = <T>(
  _class: Class<T>,
  additional: (v: T) => boolean = () => true
) => (value: T) => {
  return validateDtoWithErrors(_class, additional)(value).isSuccess();
};

export const isValidCreateEntryDto = validateDto(CreateEntryDto);
export const isValidCreateUserDto = validateDto(CreateUserDto);
export const isValidCreateUserDtoWithErrors = validateDtoWithErrors(
  CreateUserDto
);
export const isValidPatchUserDto = validateDto(PatchUserDto);
export const isValidPatchUserDtoWithErrors = validateDtoWithErrors(
  PatchUserDto
);
export const isValidCreateSlotDto = validateDto(CreateSlotDto);
