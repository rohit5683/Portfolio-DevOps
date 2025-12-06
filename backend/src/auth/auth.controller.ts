import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('setup-totp')
  async setupTotp(@Body() body: { userId: string; email: string }) {
    return this.authService.generateTotpSecret(body.userId, body.email);
  }

  @Post('verify-mfa')
  async verifyMfa(
    @Body() body: { tempToken: string; otp: string; method?: string },
  ) {
    return this.authService.verifyMfa(body.tempToken, body.otp, body.method);
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { tempToken: string }) {
    return this.authService.resendOtp(body.tempToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('verify-reset-otp')
  async verifyResetOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyResetOtp(body.email, body.otp);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { resetToken: string; newPassword: string },
  ) {
    return this.authService.resetPassword(body.resetToken, body.newPassword);
  }

  @Post('logout')
  async logout(@Body() body: any) {
    return this.authService.logout(body.userId);
  }
}
