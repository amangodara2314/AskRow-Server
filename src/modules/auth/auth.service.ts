import { ConflictError } from "../../errors/conflict.error";
import { UserDocument } from "../../models/user.model";
import { enqueueEmailJob } from "../../queues/email.queue";
import { generateOtp } from "../../utils/otp";
import { hashPassword } from "../../utils/password";
import authRepository from "./auth.repository";

async function register(data: UserDocument) {
  const { email, name, password } = data;
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser && existingUser.isVerified)
    throw new ConflictError("Email already exists. Try logging in");

  const otp = generateOtp();

  if (existingUser && !existingUser.isVerified) {
    await enqueueEmailJob({
      jobType: "email-verification",
      to: existingUser.email,
      name: existingUser.name,
      otp,
    });

    return {
      message:
        "Verification otp has been sent to your mail. Please check your inbox",
    };
  }

  const hashedPassword = hashPassword(password);

  const user = await authRepository.createUser({
    email,
    name,
    password: hashedPassword,
  });

  await enqueueEmailJob({
    jobType: "email-verification",
    to: user.email,
    name: user.name,
    otp,
  });

  return {
    message:
      "Account successfully created. Please verify your account using the otp sent to your email.",
  };
}

export default {
  register,
};
