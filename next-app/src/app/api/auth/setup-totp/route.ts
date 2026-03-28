import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, email } = await req.json();

    const secret = speakeasy.generateSecret({
      name: `Portfolio (${email})`,
      issuer: 'Portfolio DevOps',
    });

    await User.findByIdAndUpdate(userId, { totpSecret: secret.base32 });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({ secret: secret.base32, qrCode });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate TOTP' }, { status: 500 });
  }
}
