import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export const CompareToProperty = (
  prop: string,
  validator: (self: any, prop: any) => boolean,
  validationOptions?: ValidationOptions
) => (object: object, propertyName: string) =>
  registerDecorator({
    name: `bigger than ${prop}`,
    target: object.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate(value: any, args: ValidationArguments) {
        const p: any = (args.object as any)[prop];

        return validator(value, p);
      }
    }
  });
