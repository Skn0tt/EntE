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

export const daysBeforeNow = (n: number) => subDays(Date.now(), n);

const isBefore = (a: Date | number | string) => (b: Date | number | string) =>
  _isBefore(b, a);

export const isOlderThanTwoWeeksBeforeNow: SyncValidator<
  Date | number | string
> = isBefore(daysBeforeNow(14));
