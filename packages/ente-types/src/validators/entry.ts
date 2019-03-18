/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import { SyncValidator } from "./shared";
import { subDays, isBefore as _isBefore } from "date-fns";

export const daysBeforeNow = (n: number): Date => subDays(Date.now(), n);

const isBefore = (a: Date | number) => (b: Date | number) => _isBefore(b, a);

export const isOlderThanTwoWeeksBeforeNow: SyncValidator<
  Date | number
> = isBefore(daysBeforeNow(14));
