import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (user.mfaEnabled) {
      const tempPayload = { sub: user._id, role: 'mfa_pending' };
      const tempToken = jwt.sign(tempPayload, JWT_SECRET, { expiresIn: '10m' });

      if (user.mfaMethod === 'totp') {
        return NextResponse.json({ 
          mfaRequired: true, 
          mfaMethod: 'totp', 
          tempToken,
          totpSetupRequired: !user.totpSecret 
        });
      }

      if (user.mfaMethod === 'email') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const { sendMfaOtp } = await import('@/lib/services/email');
        await sendMfaOtp(user.email, otp);

        return NextResponse.json({
          mfaRequired: true,
          mfaMethod: 'email',
          tempToken
        });
      }
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
