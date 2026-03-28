import fs from 'fs';
import path from 'path';

const AUTH_DIR = '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app/api/auth';
const DIRS = ['login', 'setup-totp', 'verify-mfa'];

DIRS.forEach(dir => fs.mkdirSync(path.join(AUTH_DIR, dir), { recursive: true }));

const loginRoute = `import { NextRequest, NextResponse } from 'next/server';
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
          totpSetupRequired: !user.totpSecret,
        });
      }
      // Email MFA skipped for brevity in migration, could be added later
      return NextResponse.json({ message: 'Email MFA not implemented yet' }, { status: 501 });
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
`;

const setupTotpRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, email } = await req.json();

    const secret = speakeasy.generateSecret({
      name: \`Portfolio (\${email})\`,
      issuer: 'Portfolio DevOps',
    });

    await User.findByIdAndUpdate(userId, { totpSecret: secret.base32 });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    return NextResponse.json({ secret: secret.base32, qrCode });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate TOTP' }, { status: 500 });
  }
}
`;

const verifyMfaRoute = `import { NextRequest, NextResponse } from 'next/server';
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
    if (!user || !user.totpSecret) return NextResponse.json({ message: 'User or TOTP not found' }, { status: 404 });

    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!verified) return NextResponse.json({ message: 'Invalid TOTP code' }, { status: 401 });

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
`;

fs.writeFileSync(path.join(AUTH_DIR, 'login', 'route.ts'), loginRoute);
fs.writeFileSync(path.join(AUTH_DIR, 'setup-totp', 'route.ts'), setupTotpRoute);
fs.writeFileSync(path.join(AUTH_DIR, 'verify-mfa', 'route.ts'), verifyMfaRoute);

console.log("Auth endpoints generated!");
