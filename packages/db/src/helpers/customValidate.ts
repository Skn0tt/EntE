import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";
import { Validator } from "../logic/types";

export function CustomValidate<T>(
  func: Validator<T>,
  validationOptions?: ValidationOptions
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: func.name,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [func.name],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return func(value);
        }
      }
    });
  };
}
