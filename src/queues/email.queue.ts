import { Queue } from "bullmq";
import queueConfig from "../config/queue.config";

export type EmailJobName = "email-verification" | "welcome-email";

export type EmailJobData = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const emailQueue = new Queue<EmailJobData, void, EmailJobName>(
  "email-queue",
  queueConfig,
);

export async function enqueueEmailJob(name: EmailJobName, to: string) {
  await emailQueue.add(name, { to });
}

export default emailQueue;
