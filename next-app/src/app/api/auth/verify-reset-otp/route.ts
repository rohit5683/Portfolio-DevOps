import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();
    const user = await User.findOne({ email, otp });

    if (!user || !user.otpExpires || new Date() > user.otpExpires) {
      return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const resetToken = jwt.sign(
      { sub: user._id, email: user.email, purpose: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json({ success: true, resetToken });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
