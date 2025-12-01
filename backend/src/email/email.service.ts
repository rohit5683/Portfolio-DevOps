import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initTransporter();
  }

  private async initTransporter() {
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Or configure host/port manually
        auth: {
          user,
          pass,
        },
      });
      this.logger.log('Email transporter initialized with SMTP credentials');
    } else {
      // Fallback to Ethereal or just logging
      this.logger.warn(
        'No SMTP credentials found. Using console logging for emails.',
      );
      // We could set up Ethereal here, but console log is easier for immediate dev feedback
    }
  }

  async sendMfaOtp(email: string, otp: string) {
    if (!this.transporter) {
      this.logger.log(
        `[MOCK EMAIL] To: ${email}, Subject: Admin Login OTP, Body: Your OTP is ${otp}`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: '"Portfolio Admin" <noreply@portfolio.com>',
        to: email,
        subject: 'Admin Login OTP',
        text: `Your One-Time Password (OTP) for login is: ${otp}. It expires in 10 minutes.`,
        html: `<p>Your One-Time Password (OTP) for login is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
      this.logger.log(`OTP sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error);
      // Fallback to log in case of error (for dev purposes only, remove in prod!)
      this.logger.warn(`[FALLBACK] OTP for ${email}: ${otp}`);
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
      this.configService.get<string>('SMTP_USER');

    if (!this.transporter) {
      this.logger.log(
        `[MOCK EMAIL] Contact Form Submission\nFrom: ${contactData.name} <${contactData.email}>\nSubject: ${contactData.subject}\nMessage: ${contactData.message}`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"${contactData.name}" <${contactData.email}>`,
        replyTo: contactData.email,
        to: recipientEmail,
        subject: `Portfolio Contact: ${contactData.subject}`,
        text: `You have received a new message from your portfolio contact form.\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #3b82f6; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                📬 New Contact Form Submission
              </h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong style="color: #6b7280;">From:</strong> ${contactData.name}</p>
                <p style="margin: 5px 0;"><strong style="color: #6b7280;">Email:</strong> <a href="mailto:${contactData.email}" style="color: #3b82f6;">${contactData.email}</a></p>
                <p style="margin: 5px 0;"><strong style="color: #6b7280;">Subject:</strong> ${contactData.subject}</p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; color: #374151; white-space: pre-wrap;">${contactData.message}</p>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>This email was sent from your portfolio contact form</p>
              </div>
            </div>
          </div>
        `,
      });
      this.logger.log(
        `Contact email sent from ${contactData.email} to ${recipientEmail}`,
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
