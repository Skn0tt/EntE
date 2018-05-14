/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

declare namespace Express {
  export interface Request {
    entries?: IEntry[];
    users?: IUser[];
    slots?: ISlot[];
    user: IUser;
  }
  export interface Response {
    sentry: string;
  }
}
