import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

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
            const v = (args.object as any)[comparison] as Date;
            return value instanceof Date && +v < +value;
          } else {
            return value instanceof Date && +comparison() < +value;
          }
        }
      }
    });
  };
}
