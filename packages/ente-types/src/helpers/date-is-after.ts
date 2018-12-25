import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";
import { isAfter } from "date-fns";

export function DateIsAfter(
  comparison: (() => Date) | string,
  validationOptions?: ValidationOptions
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "DateIsAfter",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof comparison === "string") {
            const v = (args.object as any)[comparison];
            return isAfter(value, v);
          } else {
            const v = comparison();
            return isAfter(value, v);
          }
        }
      }
    });
  };
}
