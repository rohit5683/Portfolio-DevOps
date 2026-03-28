import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import speakeasy from 'speakeasy';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { tempToken, otp, method } = await req.json();

    const payload = jwt.verify(tempToken, JWT_SECRET) as any;
    if (payload.role !== 'mfa_pending') return NextResponse.json({ message: 'Invalid token type' }, { status: 401 });

    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    let verified = false;

    if (method === 'totp') {
      if (!user.totpSecret) return NextResponse.json({ message: 'TOTP not set up' }, { status: 400 });
      verified = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: otp,
        window: 1,
      });
    } else if (method === 'email') {
      if (!user.otp || !user.otpExpires) {
        return NextResponse.json({ message: 'No OTP generated' }, { status: 400 });
      }
      
      const now = new Date();
      if (now > user.otpExpires) {
        return NextResponse.json({ message: 'OTP expired' }, { status: 401 });
      }

      verified = user.otp === otp;

      // Clear OTP after successful verification
      if (verified) {
        user.otp = undefined;
        user.otpExpires = undefined;
      }
    } else {
      return NextResponse.json({ message: 'Invalid MFA method' }, { status: 400 });
    }

    if (!verified) return NextResponse.json({ message: 'Invalid OTP code' }, { status: 401 });

    const finalPayload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = jwt.sign(finalPayload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign(finalPayload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    return NextResponse.json({ message: 'MFA verification failed' }, { status: 500 });
  }
}
