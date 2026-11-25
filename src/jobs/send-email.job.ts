import type { Job } from "bullmq";
import type { EmailJobData, EmailJobName } from "../queues/email.queue";
import { sendEmail } from "../utils/send-email";

export async function sendEmailJob(job: Job<EmailJobData, void, EmailJobName>) {
  console.log(`Email job started with job id ${job.id}`);
  await sendEmail(job.data);

  console.log(`Email has been successfully sent to ${job.data.to}`);
}
