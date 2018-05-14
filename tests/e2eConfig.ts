/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

type Config = {
  baseUrl: string;
};

let config: Config | null = null;

export const get = () => {
  if (!config) {
    const baseUrl = process.env.BASE_URL;

    config = {
      baseUrl
    };
  }

  return config!;
};
