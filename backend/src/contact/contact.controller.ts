import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ContactDto } from './contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendContactEmail(@Body() contactDto: ContactDto) {
    await this.emailService.sendContactEmail(contactDto);
    return {
      success: true,
      message:
        'Your message has been sent successfully! I will get back to you soon.',
    };
  }
}
