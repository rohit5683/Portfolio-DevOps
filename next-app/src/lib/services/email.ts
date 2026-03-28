import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'rohit.vishwakarma5683@gmail.com';

export const sendMfaOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending MFA OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Your Admin Login Verification Code',
      text: `Your One-Time Password (OTP) for admin login is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your One-Time Password (OTP) for admin login is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send MFA OTP:", error);
      console.log(`[MOCK EMAIL FALLBACK] To: ${email}, OTP: ${otp}`);
      return;
    }
    
    console.log("[EMAIL SERVICE] Successfully sent email via Resend:", data);
  } catch (err) {
    console.error("[EMAIL SERVICE] Exception caught while sending MFA OTP:", err);
    console.log(`[MOCK EMAIL FALLBACK] To: ${email}, OTP: ${otp}`);
  }
};

export const sendPasswordResetOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending Password Reset OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, Reset OTP: ${otp}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: '🔑 Password Reset Verification Code',
      text: `Your password reset OTP is: ${otp}. It expires in 10 minutes.`,
      html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    });

    if (error) {
      console.error("[RESEND ERROR] Failed to send Password Reset OTP:", error);
      console.log(`[MOCK EMAIL FALLBACK] To: ${email}, OTP: ${otp}`);
      return;
    }
  } catch (err) {
    console.error("[EMAIL SERVICE] Exception caught while sending Reset OTP:", err);
    console.log(`[MOCK EMAIL FALLBACK] To: ${email}, OTP: ${otp}`);
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

  await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    replyTo: contactData.email,
    to: RECIPIENT_EMAIL,
    subject: `📬 Portfolio Contact: ${contactData.subject}`,
    text: `Name: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Subject:</strong> ${contactData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
    `
  });
};
