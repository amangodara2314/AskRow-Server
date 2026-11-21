import { templates } from "../constants/email-templates";

type GetOtpVerificationTemplate = {
  name: string;
  email: string;
  otp: string;
  expiryMinutes?: number;
};

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default function getOtpVerificationTemplate({
  name,
  email,
  otp,
  expiryMinutes = 10,
}: GetOtpVerificationTemplate) {
  const { html, getText } = templates["otp-verification"];
  const digits = String(otp).split("");
  const values = {
    NAME: escapeHtml(name || "there"),
    EMAIL: escapeHtml(email),
    OTP: escapeHtml(otp),
    EXPIRY_MINUTES: expiryMinutes,
    YEAR: new Date().getFullYear(),
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "support@askrow.com",
  };

  let emailHtml = html.replace(/{{D([1-6])}}/g, (_, i) => digits[i - 1] ?? "");
  const isValueKey = (key: string): key is keyof typeof values =>
    Object.hasOwn(values, key);

  emailHtml = emailHtml.replace(/{{(\w+)}}/g, (match: string, key: string) =>
    isValueKey(key) ? String(values[key]) : match,
  );

  let text = getText({
    name: values.NAME,
    otp: values.OTP,
    expiryMinutes: values.EXPIRY_MINUTES,
  });

  return { html: emailHtml, text };
}
