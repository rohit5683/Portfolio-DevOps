import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import { sendMfaOtp } from '@/lib/services/email';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const { tempToken } = await req.json();
    const payload = jwt.verify(tempToken, JWT_SECRET) as any;

    if (payload.role !== 'mfa_pending') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    if (user.mfaMethod !== 'email') {
      return NextResponse.json({ message: 'OTP resend only for email' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendMfaOtp(user.email, otp);

    return NextResponse.json({ success: true, message: 'OTP resent' });
  } catch (error) {
    return NextResponse.json({ message: 'Token expired' }, { status: 401 });
  }
}
