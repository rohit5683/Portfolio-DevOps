import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export async function POST(req: NextRequest) {
  try {
    const { resetToken, newPassword } = await req.json();
    const payload = jwt.verify(resetToken, JWT_SECRET) as any;

    if (payload.purpose !== 'password_reset') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.sub);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Token invalid or expired' }, { status: 401 });
  }
}
