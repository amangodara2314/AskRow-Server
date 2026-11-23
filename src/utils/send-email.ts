import { transporter } from "../config/transporter.config";
import { EmailJobData } from "../queues/email.queue";

export async function sendEmail(data: EmailJobData) {
  const mail = await transporter.sendMail({
    to: data.to,
    subject: data.subject,
    html: data.html,
    text: data.text,
  });
  console.log(mail.accepted);
}
