import { Worker } from "bullmq";
import redis from "../config/redis.config";
import { sendEmail } from "../jobs/sendEmail.job";
import type { EmailJobData, EmailJobName } from "../queues/email.queue";

const emailWorker = new Worker<EmailJobData, void, EmailJobName>(
  "email-queue",
  sendEmail,
  {
    connection: redis,
    concurrency: 5,
  },
);

emailWorker.on("failed", (job, err) => {
  console.log(
    `Email worker failed to execute job with jobId ${job?.id}`,
    err.message,
  );
});

emailWorker.on("completed", (job) => {
  console.log(`Email worker has completed job with job id ${job.id}`);
});

emailWorker.on("error", (error) => {
  console.error("Email worker error : ", error);
});

export default emailWorker;
