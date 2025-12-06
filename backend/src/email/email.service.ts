import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initResend();
  }

  private initResend() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend client initialized');
    } else {
      this.logger.warn(
        'No RESEND_API_KEY found. Using console logging for emails.',
      );
    }
  }

  async sendMfaOtp(email: string, otp: string) {
    if (!this.resend) {
      this.logger.log(
        `[MOCK EMAIL] To: ${email}, Subject: Admin Login OTP, Body: Your OTP is ${otp}`,
      );
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Admin <onboarding@resend.dev>', // Use verified domain in prod
        to: email,
        subject: '🔐 Your Admin Login Verification Code',
        text: `Your One-Time Password (OTP) for admin login is: ${otp}. It expires in 10 minutes. If you didn't request this, please ignore this email.`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Login Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header with gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px;">🔐</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Admin Login Verification</h1>
                        <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Secure access to your admin portal</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                          Hello,
                        </p>
                        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                          You've requested to log in to your admin portal. Use the verification code below to complete your login:
                        </p>
                        
                        <!-- OTP Code Box -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center;">
                              <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 20px; display: inline-block;">
                                <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                                <p style="margin: 0; color: #1f2937; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Expiry Notice -->
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 0 0 30px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>. Don't share it with anyone.
                          </p>
                        </div>
                        
                        <!-- Security Tips -->
                        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 0 0 20px;">
                          <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
                            🛡️ Security Tips:
                          </p>
                          <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                            <li>Never share your verification code with anyone</li>
                            <li>Our team will never ask for your code</li>
                            <li>If you didn't request this, please ignore this email</li>
                          </ul>
                        </div>
                        
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          If you didn't attempt to log in, you can safely ignore this email. Your account remains secure.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                          This is an automated message from Portfolio Admin
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © ${new Date().getFullYear()} Portfolio. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (error) {
        this.logger.error(`Failed to send OTP to ${email}`, error);
        this.logger.warn(`[FALLBACK] OTP for ${email}: ${otp}`);
        return;
      }

      this.logger.log(`OTP sent to ${email}. ID: ${data?.id}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error);
      this.logger.warn(`[FALLBACK] OTP for ${email}: ${otp}`);
    }
  }

  async sendPasswordResetOtp(email: string, otp: string) {
    if (!this.resend) {
      this.logger.log(
        `[MOCK EMAIL] To: ${email}, Subject: Password Reset OTP, Body: Your OTP is ${otp}`,
      );
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Admin <onboarding@resend.dev>',
        to: email,
        subject: '🔑 Password Reset Verification Code',
        text: `Your password reset OTP is: ${otp}. It expires in 10 minutes. If you didn't request this, please ignore this email.`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                        <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px;">🔑</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Password Reset Request</h1>
                        <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Reset your admin password</p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                          Hello,
                        </p>
                        <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password. Use the verification code below to proceed:
                        </p>
                        
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 30px; text-align: center;">
                              <div style="background-color: rgba(255, 255, 255, 0.95); border-radius: 8px; padding: 20px; display: inline-block;">
                                <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Reset Code</p>
                                <p style="margin: 0; color: #1f2937; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 0 0 30px;">
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                            <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>. Don't share it with anyone.
                          </p>
                        </div>
                        
                        <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin: 0 0 20px;">
                          <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                            <strong>⚠️ Didn't request this?</strong> If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                          </p>
                        </div>
                        
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          For security reasons, never share this code with anyone, including our support team.
                        </p>
                      </td>
                    </tr>
                    
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                          This is an automated message from Portfolio Admin
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © ${new Date().getFullYear()} Portfolio. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (error) {
        this.logger.error(
          `Failed to send password reset OTP to ${email}`,
          error,
        );
        this.logger.warn(`[FALLBACK] Password reset OTP for ${email}: ${otp}`);
        return;
      }

      this.logger.log(`Password reset OTP sent to ${email}. ID: ${data?.id}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset OTP to ${email}`, error);
      this.logger.warn(`[FALLBACK] Password reset OTP for ${email}: ${otp}`);
    }
  }

  async sendContactEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const recipientEmail =
      this.configService.get<string>('RECIPIENT_EMAIL') ||
      this.configService.get<string>('SMTP_USER'); // Fallback to SMTP_USER if RECIPIENT_EMAIL not set, though SMTP_USER is deprecated

    if (!this.resend) {
      this.logger.log(
        `[MOCK EMAIL] Contact Form Submission\nFrom: ${contactData.name} <${contactData.email}>\nSubject: ${contactData.subject}\nMessage: ${contactData.message}`,
      );
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        replyTo: contactData.email,
        to: recipientEmail || 'rohit.vishwakarma5683@gmail.com', // Hard fallback if no env var
        subject: `📬 Portfolio Contact: ${contactData.subject}`,
        text: `You have received a new message from your portfolio contact form.\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f7fa;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" style="max-width: 650px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header with gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                        <div style="background-color: rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px;">📬</span>
                        </div>
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">New Contact Form Submission</h1>
                        <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Someone reached out through your portfolio</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        
                        <!-- Sender Info Card -->
                        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; margin: 0 0 30px; border-left: 4px solid #3b82f6;">
                          <p style="margin: 0 0 16px; color: #1e40af; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            👤 Sender Information
                          </p>
                          <table role="presentation" style="width: 100%; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px; font-weight: 600;">Name:</td>
                              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500;">${contactData.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Email:</td>
                              <td style="padding: 8px 0;">
                                <a href="mailto:${contactData.email}" style="color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 500;">${contactData.email}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Subject:</td>
                              <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500;">${contactData.subject}</td>
                            </tr>
                          </table>
                        </div>
                        
                        <!-- Message Content -->
                        <div style="margin: 0 0 30px;">
                          <p style="margin: 0 0 12px; color: #1f2937; font-size: 14px; font-weight: 600;">
                            💬 Message:
                          </p>
                          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${contactData.message}</p>
                          </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div style="text-align: center; margin: 0 0 20px;">
                          <a href="mailto:${contactData.email}?subject=Re: ${encodeURIComponent(contactData.subject)}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                            ✉️ Reply to ${contactData.name}
                          </a>
                        </div>
                        
                        <!-- Info Box -->
                        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin: 0;">
                          <p style="margin: 0; color: #065f46; font-size: 13px; line-height: 1.6;">
                            <strong>💡 Tip:</strong> This message was sent from your portfolio contact form. Make sure to respond promptly to maintain good communication with potential clients or collaborators.
                          </p>
                        </div>
                        
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px;">
                          This email was sent from your portfolio contact form
                        </p>
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          © ${new Date().getFullYear()} Portfolio. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      if (error) {
        this.logger.error(
          `Failed to send contact email from ${contactData.email}`,
          error,
        );
        throw new Error('Failed to send email. Please try again later.');
      }

      this.logger.log(
        `Contact email sent from ${contactData.email} to ${recipientEmail}. ID: ${data?.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send contact email from ${contactData.email}`,
        error,
      );
      throw new Error('Failed to send email. Please try again later.');
    }
  }
}
