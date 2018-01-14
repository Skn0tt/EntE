import { CronJob } from 'cron';
import { dispatchWeeklySummary } from './mail';

const weeklySummaryJob = new CronJob('30 * * * * *', async () => {
  await dispatchWeeklySummary();
  console.log('Successfuly dispatched Weekly Summary');
});

export default () => {
  weeklySummaryJob.start();
};
