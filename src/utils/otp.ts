import { createHmac, randomInt } from "node:crypto";

const OTP_SECRET = process.env.OTP_SECRET || "";

function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

function hashOtp(email: string, otp: string) {
  return createHmac("sha256", OTP_SECRET)
    .update(`email:${email}:${otp}`)
    .digest("hex");
}

export { generateOtp, hashOtp };
