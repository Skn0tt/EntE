/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import * as config from "../config";

export enum Languages {
  GERMAN,
  ENGLISH
}

const getLanguage = (): Languages => config.get().LANGUAGE;

export const createTranslation = <T>(v: { en: T; de: T }): T => {
  switch (getLanguage()) {
    case Languages.ENGLISH:
      return v.en;
    case Languages.GERMAN:
      return v.de;
  }
};
