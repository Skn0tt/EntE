/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";
import { SyncValidator } from "./shared";

const DAY = 24 * 60 * 60 * 1000;

export const twoWeeksBeforeNow = () => new Date(+new Date() - 14 * DAY);

const isBefore = (a: Date) => (b: Date) => +a > +b;

export const isOlderThanTwoWeeksBeforeNow: SyncValidator<Date> = d =>
  isBefore(twoWeeksBeforeNow())(d);

export const areApart = (t: number) => (a: Date, b: Date) => +b - +a >= t;
