import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";
import * as _ from "lodash";

export const IsIntWhen = (
  when: (self: any) => boolean,
  validationOptions?: ValidationOptions
) => (object: object, propertyName: string) =>
  registerDecorator({
    name: `empty when condition true`,
    target: object.constructor,
    propertyName,
    options: validationOptions,
    validator: {
      validate(value: any, args: ValidationArguments) {
        if (when(args.object)) {
          return _.isInteger(value);
        }
        return _.isUndefined(value);
      }
    }
  });
