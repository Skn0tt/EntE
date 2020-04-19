import { registerDecorator, ValidationOptions } from "class-validator";

export const CustomObjectValidator = <T>(
  validator: (v: T) => boolean,
  validationOptions?: ValidationOptions
) => (object: object, propertyName: string) =>
  registerDecorator({
    name: validator && validator.name,
    target: object.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate(value: T | T[]) {
        if (validationOptions && validationOptions.each) {
          return (value as T[]).every(validator);
        }

        return validator(value as T);
      },
    },
  });
