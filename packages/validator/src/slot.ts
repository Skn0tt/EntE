/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { ISlotCreate } from "ente-types";
import { SyncValidator, isValidUuid } from "ente-validator";
import { matches, isBetween } from "./shared";

const isInHourRange = isBetween(1, 13);

export const isValidSlot: SyncValidator<ISlotCreate> = matches([
  s => isValidUuid(s.teacher),
  s => isInHourRange(s.hour_from),
  s => isInHourRange(s.hour_to),
  s => s.hour_from <= s.hour_to
]);
