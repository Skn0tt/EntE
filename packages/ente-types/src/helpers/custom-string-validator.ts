import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export function CustomStringValidator(
  validator: (v: string) => boolean,
  validationOptions?: ValidationOptions
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "customStringValidator",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === "string" && validator(value);
        }
      }
    });
  };
}
