/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createStore } from "./store";
import { Middleware } from "redux";
import { asyncLocalStorage } from "redux-persist/storages";

export * from "./selectors";
export * from "./actions";
export * from "./types";
export * from "./constants";

export type ReduxConfig = {
  baseUrl: string;
  middlewares?: Middleware[];
  onSagaError?: (err: Error) => void;
  onFileDownload: (file: Blob, filename: string) => void;
  storage: any;
};

const defaultConfig: ReduxConfig = {
  storage: asyncLocalStorage,
  baseUrl: "",
  middlewares: [],
  onFileDownload: () => {}
};

export let config: ReduxConfig;

const setup = async (conf: Partial<ReduxConfig>) => {
  config = { ...defaultConfig, ...conf };

  return await createStore();
};

export default setup;
