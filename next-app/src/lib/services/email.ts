import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'rohit.vishwakarma5683@gmail.com';

export const sendMfaOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending MFA OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, OTP: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: 'Portfolio Admin <onboarding@resend.dev>',
    to: email,
    subject: '🔐 Your Admin Login Verification Code',
    text: `Your One-Time Password (OTP) for admin login is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your One-Time Password (OTP) for admin login is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
  });
};

export const sendPasswordResetOtp = async (email: string, otp: string) => {
  console.log(`[EMAIL SERVICE] Sending Password Reset OTP: ${otp} to ${email}`);
  if (!resend) {
    console.log(`[MOCK EMAIL] To: ${email}, Reset OTP: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: 'Portfolio Admin <onboarding@resend.dev>',
    to: email,
    subject: '🔑 Password Reset Verification Code',
    text: `Your password reset OTP is: ${otp}. It expires in 10 minutes.`,
    html: `<p>Your password reset OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
  });
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
