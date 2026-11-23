import { Queue } from "bullmq";
import queueConfig from "../config/queue.config";
import getEmailTemplate from "../utils/get-templates";

export type EmailJobName = "email-verification" | "welcome-email";

export type EmailJobData = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type EnqueueEmailJob = {
  jobType: EmailJobName;
  to: string;
  name: string;
  otp?: string;
};

const emailQueue = new Queue<EmailJobData, void, EmailJobName>(
  "email-queue",
  queueConfig,
);

export async function enqueueEmailJob({
  jobType,
  to,
  name,
  otp = "",
}: EnqueueEmailJob) {
  if (jobType === "email-verification") {
    const { html, text, subject } = getEmailTemplate({
      template: "email-verification",
      data: { otp, name, email: to, expiryMinutes: 10 },
    });
    await emailQueue.add("email-verification", { to, subject, html, text });
  }
}

export default emailQueue;
