/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { CronJob } from "cron";
import { dispatchWeeklySummary } from "../helpers/mail";

const weeklySummaryJob = new CronJob("0 16 * * 5", async () => {
  await dispatchWeeklySummary();
  console.log("Successfuly dispatched Weekly Summary");
});

export default () => {
  weeklySummaryJob.start();
};
