import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return user;
    }
    return null;
  }

  async login(user: any) {
    // If MFA is enabled, handle based on method
    if (user.mfaEnabled) {
      const tempPayload = { sub: user._id, role: 'mfa_pending' };
      const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '10m' });

      // Email OTP method
      if (user.mfaMethod === 'email') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this.usersService.update(user._id, { otp, otpExpires });
        await this.emailService.sendMfaOtp(user.email, otp);

        return {
          mfaRequired: true,
          mfaMethod: 'email',
          tempToken,
        };
      }

      // TOTP (Google Authenticator) method
      if (user.mfaMethod === 'totp') {
        return {
          mfaRequired: true,
          mfaMethod: 'totp',
          tempToken,
          totpSetupRequired: !user.totpSecret,
        };
      }
    }

    // If MFA is disabled, issue tokens directly
    return this.issueTokens(user);
  }

  async generateTotpSecret(userId: string, email: string) {
    // Generate a new TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Portfolio (${email})`,
      issuer: 'Portfolio DevOps',
    });

    // Save the secret to the user
    await this.usersService.update(userId, { totpSecret: secret.base32 });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
    };
  }

  async verifyMfa(tempToken: string, otp: string, method?: string) {
    try {
      const payload = this.jwtService.verify(tempToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.role !== 'mfa_pending') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Determine method from user or parameter
      const mfaMethod = method || user.mfaMethod || 'email';

      // Email OTP verification
      if (mfaMethod === 'email') {
        if (!user.otp || !user.otpExpires) {
          throw new UnauthorizedException('Invalid OTP request');
        }

        if (new Date() > user.otpExpires) {
          throw new UnauthorizedException('OTP expired');
        }

        if (user.otp !== otp) {
          throw new UnauthorizedException('Invalid OTP');
        }

        // Clear OTP
        await this.usersService.update((user as any)._id, {
          otp: null,
          otpExpires: null,
        });
      }
      // TOTP verification
      else if (mfaMethod === 'totp') {
        if (!user.totpSecret) {
          throw new UnauthorizedException('TOTP not configured');
        }

        const verified = speakeasy.totp.verify({
          secret: user.totpSecret,
          encoding: 'base32',
          token: otp,
          window: 1,
        });

        if (!verified) {
          throw new UnauthorizedException('Invalid TOTP code');
        }
      }

      return this.issueTokens(user);
    } catch (error) {
      throw new UnauthorizedException('MFA verification failed');
    }
  }

  private async issueTokens(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.updateRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshTokenHash: hash });
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshTokenHash: null });
  }
}
