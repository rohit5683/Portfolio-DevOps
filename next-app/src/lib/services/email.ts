import { Resend } from 'resend';
import { SITE_CONFIG } from '@/constants/metadata';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'rohit.vishwakarma5683@gmail.com';

const getEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #f1f5f9; background-color: #020617; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; padding: 40px; background-color: #0f172a; border-radius: 16px; border: 1px solid #1e293b; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { color: #3b82f6; font-size: 24px; font-weight: bold; text-decoration: none; letter-spacing: -0.025em; }
    .content { margin-bottom: 40px; font-size: 16px; color: #cbd5e1; }
    .highlight { color: #3b82f6; font-weight: 600; }
    .otp-container { background: #1e293b; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px dashed #3b82f6; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; margin: 0; }
    .footer { text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; pt: 24px; }
    .social-links { margin-top: 16px; }
    .social-links a { color: #3b82f6; text-decoration: none; margin: 0 10px; }
    .btn { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="${SITE_CONFIG.url}" class="logo">${SITE_CONFIG.name}</a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.</p>
      <div class="social-links">
        <a href="${SITE_CONFIG.links.github}">GitHub</a>
        <a href="${SITE_CONFIG.links.linkedin}">LinkedIn</a>
        <a href="${SITE_CONFIG.url}">Portfolio</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

export const sendMfaOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending MFA OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}`);
    return;
  }

  const html = getEmailTemplate(`
    <h2 style="color: #f8fafc; margin-top: 0;">Verification Code</h2>
    <p>We received a request to access your admin account. Please use the following code to complete your login:</p>
    <div class="otp-container">
      <p class="otp-code">${otp}</p>
    </div>
    <p>This code will expire in <span class="highlight">10 minutes</span>. If you didn't request this, please ignore this email or contact support if you're concerned about your account security.</p>
  `, '🔐 Admin Login Verification');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Your Admin Login Verification Code',
      html
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send MFA OTP:", error);
      return;
    }
    console.log("[EMAIL SERVICE] Successfully sent email via Resend:", data);
  } catch (err) {
    console.error("[EMAIL SERVICE] Exception caught while sending MFA OTP:", err);
  }
};

export const sendPasswordResetOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending Password Reset OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, Reset OTP: ${otp}`);
    return;
  }

  const html = getEmailTemplate(`
    <h2 style="color: #f8fafc; margin-top: 0;">Password Reset</h2>
    <p>You requested to reset your password. Use the verification code below to proceed with the reset process:</p>
    <div class="otp-container">
      <p class="otp-code">${otp}</p>
    </div>
    <p>This code is valid for <span class="highlight">10 minutes</span>. If you did not request a password reset, you can safely ignore this email.</p>
  `, '🔑 Password Reset Verification');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: '🔑 Password Reset Verification Code',
      html
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send Password Reset OTP:", error);
      return;
    }
  } catch (err) {
    console.error("[EMAIL SERVICE] Exception caught while sending Reset OTP:", err);
  }
};

export const sendContactEmail = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  if (!resend) {
    console.log(`[MOCK CONTACT EMAIL] From: ${contactData.email}, Msg: ${contactData.message}`);
    return;
  }

  const html = getEmailTemplate(`
    <h2 style="color: #f8fafc; margin-top: 0;">New Inquiry Received</h2>
    <p>You have a new message from your portfolio contact form.</p>
    <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 24px 0;">
      <p style="margin: 0 0 10px 0;"><strong style="color: #3b82f6;">From:</strong> ${contactData.name} (${contactData.email})</p>
      <p style="margin: 0 0 10px 0;"><strong style="color: #3b82f6;">Subject:</strong> ${contactData.subject}</p>
      <p style="margin: 20px 0 0 0;"><strong style="color: #3b82f6;">Message:</strong></p>
      <p style="margin: 10px 0 0 0; white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
    </div>
    <p>Click below to reply directly to the sender:</p>
    <a href="mailto:${contactData.email}?subject=Re: ${contactData.subject}" class="btn">Reply to ${contactData.name}</a>
  `, '📬 New Portfolio Inquiry');

  await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    replyTo: contactData.email,
    to: RECIPIENT_EMAIL,
    subject: `📬 Portfolio Contact: ${contactData.subject}`,
    html
  });
};
