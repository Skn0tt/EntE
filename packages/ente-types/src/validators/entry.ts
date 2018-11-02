/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { SyncValidator } from "./";
import { matches, not, isLength } from "./shared";
import { isValidSlot } from "./slot";
import * as _ from "lodash";
import { CreateEntryDto } from "../dtos";

const DAY = 24 * 60 * 60 * 1000;

export const twoWeeksBeforeNow = () => new Date(+new Date() - 14 * DAY);

const isBefore = (a: Date) => (b: Date) => +a > +b;

export const isOlderThanTwoWeeksBeforeNow: SyncValidator<Date> = d =>
  isBefore(twoWeeksBeforeNow())(d);

export const areApart = (t: number) => (a: Date, b: Date) => +b - +a >= t;

export const isValidEntry: SyncValidator<CreateEntryDto> = matches([
  v => not(isOlderThanTwoWeeksBeforeNow)(v.date),
  v => v.slots.every(isValidSlot),
  // A: dateEnd doesn't exist
  // B: v shouldn't contains slots
  v => _.isUndefined(v.dateEnd) !== (v.slots.length === 0),
  // A: dateEnd doesn't exist
  // B: dates should be at least 1 day apart
  v => _.isUndefined(v.dateEnd) || areApart(1 * DAY)(v.date, v.dateEnd)
]);
