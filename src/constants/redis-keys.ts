import { getRedisKey } from "../utils/create-redis-key";

const REDIS_KEYS = {
  otpKey: (email: string) => getRedisKey("otp", email),
  otpCooldown: (email: string) => getRedisKey("otp", "cooldown", email),
  otpSentCount: (email: string) => getRedisKey("otp", "sent", email),
};

export default REDIS_KEYS;
