/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { createClient } from "redis";
import chalk, { Chalk } from "chalk";
import * as crypto from "crypto";
import { redis } from "ente-types";

const client = createClient("redis://redis");

const generateSecret = () => crypto.randomBytes(48).toString("hex");

const oldSecret = client.get(redis.JWT_SECRETS, (err, reply) => {
  if (err) {
    throw err;
  }
  const arr: string[] = JSON.parse(reply);
  const newArr: string[] = !!arr
    ? [generateSecret(), arr[0]]
    : [generateSecret(), generateSecret()];

  client.set(redis.JWT_SECRETS, JSON.stringify(newArr), (err, reply) => {
    if (err) {
      throw err;
    }
    if (reply === "OK") {
      console.log(chalk.blue("Rotated JWT keys."));
      return process.exit(0);
    }

    throw new Error("Error encountered rotating JWT keys.");
  });
});
