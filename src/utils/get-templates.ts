import { templates } from "../constants/email-templates";

type TemplateName = keyof typeof templates;

type TemplateArgs = {
  "email-verification": {
    name: string;
    email: string;
    otp: string;
    expiryMinutes?: number;
  };
  "welcome-email": {
    name: string;
  };
};

type TemplateRequest = {
  [T in TemplateName]: {
    template: T;
    data: TemplateArgs[T];
  };
}[TemplateName];

type TemplateValues = Record<string, string | number>;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function renderHtml(source: string, values: TemplateValues): string {
  return source.replace(/{{(\w+)}}/g, (match: string, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : match,
  );
}

export default function getEmailTemplate(request: TemplateRequest) {
  if (request.template === "email-verification") {
    const { data } = request;
    const expiryMinutes = data.expiryMinutes ?? 10;

    const digitValues: Record<string, string> = {};
    for (let index = 0; index < 6; index += 1) {
      digitValues[`D${index + 1}`] = escapeHtml(data.otp[index] ?? "");
    }

    const values: TemplateValues = {
      ...digitValues,
      NAME: escapeHtml(data.name || "there"),
      EMAIL: escapeHtml(data.email),
      OTP: escapeHtml(data.otp),
      EXPIRY_MINUTES: expiryMinutes,
      YEAR: new Date().getFullYear(),
    };

    return {
      html: renderHtml(templates["email-verification"].html, values),
      text: templates["email-verification"].getText({
        name: data.name,
        otp: data.otp,
        expiryMinutes,
      }),
      subject: templates["email-verification"].subject,
    };
  }

  const { data } = request;
  const values: TemplateValues = {
    NAME: escapeHtml(data.name || "there"),
    YEAR: new Date().getFullYear(),
  };

  return {
    html: renderHtml(templates["welcome-email"].html, values),
    text: templates["welcome-email"].getText(),
    subject: templates["email-verification"].subject,
  };
}
