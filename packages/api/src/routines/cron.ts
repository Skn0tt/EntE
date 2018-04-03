import { CronJob } from "cron";
import { dispatchWeeklySummary } from "../helpers/mail";

const weeklySummaryJob = new CronJob("0 16 * * 5", async () => {
  await dispatchWeeklySummary();
  console.log("Successfuly dispatched Weekly Summary");
});

export default () => {
  weeklySummaryJob.start();
};
