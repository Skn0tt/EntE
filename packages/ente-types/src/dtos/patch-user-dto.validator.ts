import { PatchUserDto } from ".";
import { makeAnnotationValidator } from "../validators/make-annotation-validator";

export const PatchUserDtoValidator = makeAnnotationValidator(PatchUserDto);
