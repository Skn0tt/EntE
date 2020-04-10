import { registerDecorator, ValidationOptions } from "class-validator";

export const CustomStringValidator = (
  validator: (v: string) => boolean,
  validationOptions?: ValidationOptions
) => (object: object, propertyName: string) =>
  registerDecorator({
    name: validator && validator.name,
    target: object.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate(value: any) {
        if (validationOptions && validationOptions.each) {
          return (value as string[]).every(validator);
        }

        return typeof value === "string" && validator(value);
      }
    }
  });
