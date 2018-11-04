import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export const EmptyWhen = (
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
        return !when(args.object) || value.length === 0;
      }
    }
  });
