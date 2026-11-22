import "dotenv/config";
import { transporter } from "../config/transporter.config";
import { EmailJobData } from "../queues/email.queue";
import getEmailTemplate from "./get-templates";

export async function sendEmail(data: EmailJobData) {
  const mail = await transporter.sendMail({
    to: data.to,
    subject: data.subject,
    html: data.html,
    text: data.text,
  });
  console.log(mail.accepted);
}

// const { html, text } = getEmailTemplate({
//   name: "Aman",
//   email: "amangodara.dev@gmail.com",
//   otp: "234561",
// });

// await sendEmail({
//   to: "amangodara.dev@gmail.com",
//   subject: "Testing",
//   html,
//   text,
// });
