import redis from "./redis.config";

const queueConfig = {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: 100,
  },
};

export default queueConfig;
