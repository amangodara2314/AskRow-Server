import { Queue } from "bullmq";
import queueConfig from "../config/queue.config";

export type EmailJobName = "email-verification" | "welcome-email";

export type EmailJobData = {
  to: string;
  subject: string;
  body: string;
};

const emailQueue = new Queue<EmailJobData, void, EmailJobName>(
  "email-queue",
  queueConfig,
);

export default emailQueue;
