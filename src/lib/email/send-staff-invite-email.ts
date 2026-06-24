import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://winterset-law-group.vercel.app";

interface StaffInviteEmailParams {
  to: string;
  role: string;
  token: string;
}

export async function sendStaffInviteEmail({ to, role, token }: StaffInviteEmailParams) {
  const inviteUrl = `${APP_URL}/accept-invite?token=${token}`;
  const roleLabel = role === "ATTORNEY" ? "Attorney" : "Staff";

  await resend.emails.send({
    from: "Winterset Law Group <onboarding@resend.dev>",
    to,
    subject: "You've Been Invited to the Winterset Law Group Staff Portal",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
        <tr><td style="background-color:#10283B; padding:32px 40px; text-align:center;">
          <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Winterset Law Group</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <p style="margin:0 0 16px; color:#1a1a1a; font-size:16px; line-height:1.5;">You've been invited to join the Winterset Law Group staff portal as <strong>${roleLabel}</strong>.</p>
          <p style="margin:0 0 24px; color:#1a1a1a; font-size:16px; line-height:1.5;">Click the button below to set up your account and create a password. This link expires in 48 hours.</p>
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td style="background-color:#B1784D; border-radius:6px;">
              <a href="${inviteUrl}" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:16px; font-weight:600; text-decoration:none;">Set Up Account</a>
            </td></tr>
          </table>
          <p style="margin:24px 0 0; color:#6b7280; font-size:13px; line-height:1.5;">If you weren't expecting this invite, you can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
}
