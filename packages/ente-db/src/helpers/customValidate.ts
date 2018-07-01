/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

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
