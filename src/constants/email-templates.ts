const OTP_VERIFICATION_TEMPLATE = {
  subject: "Your AskRow verification code",
  html: `
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no"
    />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>Your AskRow verification code</title>
    <style>
      body,
      table,
      td,
      a {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      a {
        text-decoration: none;
      }

      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          border-radius: 0 !important;
          border-left: 0 !important;
          border-right: 0 !important;
        }
        .px {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .otp {
          font-size: 30px !important;
          letter-spacing: 8px !important;
          padding-left: 8px !important;
        }
      }

      @media (prefers-color-scheme: dark) {
        .page-bg {
          background-color: #0b0b0c !important;
        }
        .card {
          background-color: #141416 !important;
          border-color: #26262a !important;
        }
        .ink {
          color: #f4f4f5 !important;
        }
        .muted {
          color: #a1a1aa !important;
        }
        .code-box {
          background-color: #1c1c1f !important;
          border-color: #2e2e33 !important;
        }
        .rule {
          border-color: #26262a !important;
        }
      }
    </style>
  </head>

  <body
    class="page-bg"
    style="margin: 0; padding: 0; background-color: #f6f7f9"
  >
    <!-- Preheader -->
    <div
      style="
        display: none;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        mso-hide: all;
      "
    >
      Your AskRow verification code is {{OTP}}. It expires in {{EXPIRY_MINUTES}}
      minutes.
      &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
    </div>

    <table
      role="presentation"
      class="page-bg"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      bgcolor="#F6F7F9"
      style="background-color: #f6f7f9"
    >
      <tr>
        <td align="center" style="padding: 40px 12px">
          <table
            role="presentation"
            class="container card"
            width="520"
            cellpadding="0"
            cellspacing="0"
            border="0"
            bgcolor="#FFFFFF"
            style="
              width: 520px;
              max-width: 520px;
              background-color: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
            "
          >
            <!-- Wordmark -->
            <tr>
              <td
                class="px ink"
                style="
                  padding: 36px 44px 0 44px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 20px;
                  font-weight: 700;
                  letter-spacing: -0.3px;
                  color: #111827;
                "
              >
                AskRow
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td
                class="px ink"
                style="
                  padding: 32px 44px 0 44px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 24px;
                  line-height: 32px;
                  font-weight: 600;
                  letter-spacing: -0.4px;
                  color: #111827;
                "
              >
                Verify your email address
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td
                class="px muted"
                style="
                  padding: 12px 44px 0 44px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 15px;
                  line-height: 24px;
                  color: #6b7280;
                "
              >
                Hi {{NAME}}, enter this code to verify
                <span class="ink" style="color: #111827">{{EMAIL}}</span> and
                finish creating your account.
              </td>
            </tr>

            <!-- Code -->
            <tr>
              <td class="px" style="padding: 28px 44px 0 44px">
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="code-box otp ink"
                      align="center"
                      bgcolor="#F6F7F9"
                      style="
                        background-color: #f6f7f9;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        padding: 22px 10px 22px 22px;
                        font-family:
                          &quot;SF Mono&quot;, Menlo, Consolas,
                          &quot;Courier New&quot;, monospace;
                        font-size: 36px;
                        line-height: 44px;
                        font-weight: 600;
                        letter-spacing: 12px;
                        color: #111827;
                      "
                    >
                      {{OTP}}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry -->
            <tr>
              <td
                class="px muted"
                style="
                  padding: 16px 44px 0 44px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 14px;
                  line-height: 22px;
                  color: #6b7280;
                "
              >
                This code expires in {{EXPIRY_MINUTES}} minutes and can be used
                once.
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td class="px" style="padding: 32px 44px 0 44px">
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      class="rule"
                      style="
                        border-top: 1px solid #e5e7eb;
                        font-size: 0;
                        line-height: 0;
                      "
                    >
                      &nbsp;
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Security + footer -->
            <tr>
              <td
                class="px muted"
                style="
                  padding: 24px 44px 40px 44px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 13px;
                  line-height: 21px;
                  color: #6b7280;
                "
              >
                If you didn't request this code, you can safely ignore this
                email. Never share this code with anyone. AskRow will never ask
                for it.
              </td>
            </tr>
          </table>

          <table
            role="presentation"
            class="container"
            width="520"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="width: 520px; max-width: 520px"
          >
            <tr>
              <td
                align="center"
                class="muted"
                style="
                  padding: 20px 24px 0 24px;
                  font-family:
                    &quot;Segoe UI&quot;, Helvetica, Arial, sans-serif;
                  font-size: 12px;
                  line-height: 18px;
                  color: #9ca3af;
                "
              >
                &copy; {{YEAR}} AskRow. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  getText({
    name,
    otp,
    expiryMinutes,
  }: {
    name: string;
    otp: string;
    expiryMinutes: number;
  }) {
    return [
      `Hi ${name || "there"},`,
      ``,
      `Your AskRow verification code is: ${otp}`,
      `It expires in ${expiryMinutes} minutes and can only be used once.`,
      ``,
      `If you didn't request this, you can ignore this email.`,
      ``,
      `- AskRow`,
    ].join("\n");
  },
};

export const templates = {
  "email-verification": OTP_VERIFICATION_TEMPLATE,
  "welcome-email": {
    html: "<p>Welcome</p>",
    getText() {
      return "Hi";
    },
    subject: "Welcome back!",
  },
};
