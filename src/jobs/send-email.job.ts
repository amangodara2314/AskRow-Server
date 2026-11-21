import type { Job } from "bullmq";
import type { EmailJobData, EmailJobName } from "../queues/email.queue";

export async function sendEmail(job: Job<EmailJobData, void, EmailJobName>) {}
