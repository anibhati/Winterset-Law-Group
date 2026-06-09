// src/lib/email/send-reset-email.ts

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://winterset-law-group.vercel.app";

interface ResetEmailParams {
  to: string;
  name: string;
  token: string;
}

export async function sendPasswordResetEmail({ to, name, token }: ResetEmailParams) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#10283B; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">
                Winterset Law Group
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px; color:#1a1a1a; font-size:16px; line-height:1.5;">
                Hi ${name},
              </p>
              <p style="margin:0 0 24px; color:#1a1a1a; font-size:16px; line-height:1.5;">
                We received a request to reset the password for your account. Click the button below to set a new password. This link expires in 1 hour.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#B1784D; border-radius:6px; text-align:center;">
                    <a href="${resetUrl}"
                       style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:16px; font-weight:600; text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px; color:#6b7280; font-size:14px; line-height:1.5;">
                If you didn't request this, you can safely ignore this email. Your password will not change.
              </p>
              <p style="margin:0 0 8px; color:#6b7280; font-size:14px; line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 32px; color:#B1784D; font-size:13px; word-break:break-all;">
                ${resetUrl}
              </p>
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 24px;" />
              <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.6;">
                Christopher J. Stevens<br />
                <span style="color:#6b7280;">Winterset Law Group</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:24px 40px; text-align:center;">
              <p style="margin:0; color:#9ca3af; font-size:12px; line-height:1.5;">
                This is an automated message from Winterset Law Group.
                Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "Reset Your Password — Winterset Law Group",
    html,
  });
}