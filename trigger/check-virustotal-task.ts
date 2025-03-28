import { logger, schedules, wait } from '@trigger.dev/sdk/v3';
import { Keys } from '@/lib/constants';

export const checkVirusTotalTask = schedules.task({
  id: Keys.CHECK_VIRUSTOTAL_TASK,
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload) => {
    const distanceInMs =
      payload.timestamp.getTime() - (payload.lastTimestamp ?? new Date()).getTime();

    logger.log('First scheduled tasks', { payload, distanceInMs });

    // Wait for 3 seconds
    await wait.for({ seconds: 3 });

    // Format the timestamp using the timezone from the payload
    const formatted = payload.timestamp.toLocaleString('fi-FI', {
      timeZone: payload.timezone,
    });

    logger.log(formatted);
  },
});
