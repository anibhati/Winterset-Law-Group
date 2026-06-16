import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://winterset-law-group.vercel.app";
const FIRM_PHONE = "(614) 734-5005";

type RequestType = "payment plan" | "dispute" | "consultation";
type StatusType = "APPROVED" | "REJECTED" | "CONFIRMED" | "CANCELLED";

const STATUS_COPY: Record<StatusType, { subject: string; headline: string; body: string; color: string }> = {
  APPROVED: {
    subject: "Your Request Has Been Approved",
    headline: "Great news — your request has been approved.",
    body: "Our team has reviewed your submission and approved it. Please log in to your account to view the details.",
    color: "#16a34a",
  },
  REJECTED: {
    subject: "Update on Your Request",
    headline: "Your request was not approved at this time.",
    body: "After reviewing your submission, we were unable to approve it. Please contact us if you have questions or would like to discuss your options.",
    color: "#dc2626",
  },
  CONFIRMED: {
    subject: "Your Consultation Has Been Confirmed",
    headline: "Your consultation is confirmed.",
    body: "We have confirmed your scheduled call. Our team will reach out at the time you selected. Please make sure your phone is available.",
    color: "#16a34a",
  },
  CANCELLED: {
    subject: "Your Consultation Has Been Cancelled",
    headline: "Your consultation has been cancelled.",
    body: "Unfortunately your scheduled consultation has been cancelled. Please contact us or log in to schedule a new time.",
    color: "#dc2626",
  },
};

interface StatusEmailParams {
  to: string;
  name: string;
  status: StatusType;
  requestType: RequestType;
  staffNotes?: string | null;
}

export async function sendStatusEmail({ to, name, status, requestType, staffNotes }: StatusEmailParams) {
  const copy = STATUS_COPY[status];
  const dashboardUrl = `${APP_URL}/dashboard`;

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
          <tr>
            <td style="background-color:#10283B; padding:32px 40px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Winterset Law Group</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px; color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">
                ${requestType.toUpperCase()}
              </p>
              <h2 style="margin:0 0 24px; color:#10283B; font-size:20px; font-weight:700;">
                ${copy.headline}
              </h2>
              <p style="margin:0 0 16px; color:#1a1a1a; font-size:16px; line-height:1.5;">
                Hi ${name},
              </p>
              <p style="margin:0 0 24px; color:#1a1a1a; font-size:16px; line-height:1.5;">
                ${copy.body}
              </p>
              ${staffNotes ? `
              <div style="background-color:#f9fafb; border-left:4px solid #B1784D; border-radius:4px; padding:16px; margin:0 0 24px;">
                <p style="margin:0 0 6px; color:#B1784D; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Note from our team</p>
                <p style="margin:0; color:#1a1a1a; font-size:15px; line-height:1.5;">${staffNotes}</p>
              </div>
              ` : ""}
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#B1784D; border-radius:6px; text-align:center;">
                    <a href="${dashboardUrl}" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:16px; font-weight:600; text-decoration:none;">
                      View My Account
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px; color:#6b7280; font-size:14px; line-height:1.5;">
                If you have questions, call us at <a href="tel:${FIRM_PHONE}" style="color:#10283B; font-weight:600;">${FIRM_PHONE}</a>.
              </p>
              <hr style="border:none; border-top:1px solid #e5e7eb; margin:0 0 24px;" />
              <p style="margin:0; color:#1a1a1a; font-size:14px; line-height:1.6;">
                Christopher J. Stevens<br />
                <span style="color:#6b7280;">Winterset Law Group</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9fafb; padding:24px 40px; text-align:center;">
              <p style="margin:0; color:#9ca3af; font-size:12px; line-height:1.5;">
                This is an automated message from Winterset Law Group. Please do not reply directly to this email.
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
    subject: `${copy.subject} — Winterset Law Group`,
    html,
  });
}
