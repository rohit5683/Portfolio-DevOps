import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { sendPasswordResetOtp } from '@/lib/services/email';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    // Always return success for security
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      await sendPasswordResetOtp(user.email, otp);
    }

    return NextResponse.json({ success: true, message: 'If email exists, reset code sent' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
