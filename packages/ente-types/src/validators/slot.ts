/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { matches, isBetween } from "./shared";
import { CreateSlotDto } from "../dtos";
import { isValidUuid } from "./user";
import { SyncValidator } from ".";

const isInHourRange = isBetween(1, 13);

export const isValidSlot: SyncValidator<CreateSlotDto> = matches([
  s => isValidUuid(s.teacherId),
  s => isInHourRange(s.from),
  s => isInHourRange(s.to),
  s => s.from <= s.to
]);
