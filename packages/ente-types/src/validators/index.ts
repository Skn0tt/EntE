/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as _ from "lodash";

export type Validator<T> = (v: T) => boolean | Promise<boolean>;

export type SyncValidator<T> = (v: T) => boolean;
export type AsyncValidator<T> = (v: T) => Promise<boolean>;

export * from "./auth";
export * from "./entry";
export * from "./user";
