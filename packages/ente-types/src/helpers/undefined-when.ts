import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export const UndefinedWhen = (
  when: (self: any) => boolean,
  validationOptions?: ValidationOptions
) => (object: object, propertyName: string) =>
  registerDecorator({
    name: `empty when condition true`,
    target: object.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate(value: any[], args: ValidationArguments) {
        if (when(args.object)) {
          return typeof value === "undefined";
        } else {
          return true;
        }
      }
    }
  });
