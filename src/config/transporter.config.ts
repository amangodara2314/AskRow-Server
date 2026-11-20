import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function verifyEmailTransporter(): Promise<void> {
  try {
    await transporter.verify();
    console.log("Transporter is verified and can send emails.");
  } catch (err) {
    console.error("Unable to connect to email transporter :", err);
  }
}
