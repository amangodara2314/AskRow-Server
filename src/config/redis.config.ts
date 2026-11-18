import Redis from "ioredis";

const redisConnectionUrl = process.env.REDIS_URL || "";

if (!redisConnectionUrl) {
  throw new Error("Redis connection url is missing");
}

const redis = new Redis(redisConnectionUrl);

export default redis;
