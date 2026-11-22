import { Queue } from "bullmq";
import queueConfig from "../config/queue.config";

export type EmailJobName = "email-verification" | "welcome-email";

export type EmailJobData = {
  to: string;
  subject: string;
  text: string;
  html: string;
  name: string;
  otp?: string;
};

type EnqueueEmailJob = Pick<EmailJobData, "to" | "name" | "otp"> & {
  jobType: EmailJobName;
};
const emailQueue = new Queue<EmailJobData, void, EmailJobName>(
  "email-queue",
  queueConfig,
);

export async function enqueueEmailJob({
  jobType,
  to,
  name,
  otp,
}: EnqueueEmailJob) {
  await emailQueue.add(name, { to });
}

export default emailQueue;
