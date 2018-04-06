import { SyncValidator } from "./";
import {
  isLength,
  containsNumbers,
  containsSpecialChars,
  matches
} from "./shared";

/**
 * Checks a password for being valid.
 * Rules:
 * - 8-100 characters
 * - >=1 number
 * - >=1 special character ( ?!&/(!"") )
 * - can contain spaces
 */
export const isValidPassword: SyncValidator<string> = matches([
  isLength(8, 100),
  containsNumbers,
  containsSpecialChars
]);
