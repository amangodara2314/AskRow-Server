import redis from "../../config/redis.config";
import REDIS_KEYS from "../../constants/redis-keys";
import { AppError } from "../../errors/app.error";
import { generateOtp, hashOtp } from "../../utils/otp";

function positiveIntegerEnv(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);

  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
}

const OTP_MAX_SENDS_PER_HOUR = positiveIntegerEnv("OTP_MAX_SENDS_PER_HOUR", 5);
const OTP_RETRY_COOLDOWN_SECONDS = positiveIntegerEnv("OTP_RETRY_COOLDOWN", 60);
const OTP_TTL_SECONDS = positiveIntegerEnv("OTP_TTL_MINUTES", 60) * 60;

async function issueOtp(email: string) {
  const otpCooldownKey = REDIS_KEYS.otpCooldown(email);
  const acquired = await redis.set(
    otpCooldownKey,
    "1",
    "EX",
    OTP_RETRY_COOLDOWN_SECONDS,
    "NX",
  );
  if (!acquired) {
    const ttl = await redis.ttl(otpCooldownKey);
    throw new AppError(`Cannot send otp before ${ttl} seconds`, 429);
  }

  const otpSentCountKey = REDIS_KEYS.otpSentCount(email);
  const res = await redis
    .multi()
    .incr(otpSentCountKey)
    .expire(otpSentCountKey, 3600, "NX")
    .exec();

  const incrementResult = res?.[0];

  if (!incrementResult || incrementResult[0]) {
    throw new AppError("Unable to set otp sent count", 400);
  }

  const otpSentCount = incrementResult[1];

  if (typeof otpSentCount !== "number") {
    throw new AppError("Unable to set otp sent count", 400);
  }

  if (otpSentCount > OTP_MAX_SENDS_PER_HOUR) {
    throw new AppError("Too many requests. Please try again later", 429);
  }

  const otp = generateOtp();
  const otpHash = hashOtp(email, otp);
  const otpKey = REDIS_KEYS.otpKey(email);
  await redis
    .multi()
    .del(otpKey)
    .hset(otpKey, { otpHash, attempts: 0 })
    .expire(otpKey, OTP_TTL_SECONDS)
    .exec();

  return { otp, otpHash };
}

export default {
  issueOtp,
};
