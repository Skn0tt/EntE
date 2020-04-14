/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createStore } from "./store";
import { updateConfig, ReduxConfig } from "./config";

export * from "./selectors";
export * from "./actions";
export * from "./types";
export * from "./constants";
export * from "./config";

const setup = (conf: Partial<ReduxConfig>) => {
  updateConfig(conf);

  return await createStore();
};

export default setup;
