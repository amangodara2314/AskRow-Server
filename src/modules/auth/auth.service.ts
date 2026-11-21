import { ConflictError } from "../../errors/conflict.error";
import { UserDocument } from "../../models/user.model";
import { enqueueEmailJob } from "../../queues/email.queue";
import authRepository from "./auth.repository";

// check if the email already exists in the database
// if it does and its verified return already exists please login
// if it does and its not verified send verification email otp
// if its does create user in database
// send otp in email and return

async function register(data: Omit<UserDocument, "password">) {
  const { email, name } = data;
  const existingUser = await authRepository.findUserByEmail(email)
  if (existingUser && existingUser.isVerified) throw new ConflictError("Email already exists. Try logging in")
  
  if(existingUser && !existingUser.isVerified) {
    await enqueueEmailJob("email-verification",)
  }
}
