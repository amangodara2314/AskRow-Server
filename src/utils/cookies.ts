import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const cookiesOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export const REFRESH_COOKIE_NAME = isProduction ? "__Host" : "refresh";

export function setCookie(res: Response, token: string, expiresAt: Date) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...cookiesOptions,
    expires: expiresAt,
  });
}

export function clearCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, cookiesOptions);
}
