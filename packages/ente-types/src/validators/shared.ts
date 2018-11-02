import { SyncValidator } from ".";

/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

export const matches = <T>(
  validators: SyncValidator<T>[]
): SyncValidator<T> => t => validators.every(v => v(t));

/**
 * @param min inclusive
 * @param max exclusive
 */
export const isBetween = (
  min: number,
  max: number
): SyncValidator<number> => n => n >= min && n < max;

export const isLength = (
  min: number,
  max: number
): SyncValidator<string> => v => isBetween(min, max)(v.length);

// https://stackoverflow.com/a/28813213/8714863
export const containsNumbers: SyncValidator<string> = v => /\d/.test(v);

export const containsSpecialChars: SyncValidator<string> = v =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/g.test(v);

// https://stackoverflow.com/a/42203701/8714863
export const containsSpecialCharsAll: SyncValidator<string> = v =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(v);

export const containsSpaces: SyncValidator<string> = v => / /g.test(v);

export const not = <T>(v: SyncValidator<T>): SyncValidator<T> => (p: T) =>
  !v(p);
