import { transporter } from "../config/transporter.config";
import { EmailJobData } from "../queues/email.queue";

export async function sendEmail(data: EmailJobData) {
  const mail = await transporter.sendMail({
    to: data.to,
    subject: data.subject,
    html: data.body,
  });

  console.log("Email sent successfully to :", data.to);

  console.log("Accepted:", mail.accepted, "Message id:", mail.messageId);
}
