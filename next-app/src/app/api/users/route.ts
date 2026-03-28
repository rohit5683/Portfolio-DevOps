import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth/jwt';
import bcrypt from 'bcrypt';

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const users = await User.find({}).select('-passwordHash -refreshTokenHash');
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const passwordHash = await bcrypt.hash(body.password || 'changeme', 10);
  const newUser = await User.create({ ...body, passwordHash });
  return NextResponse.json({ message: 'User created' });
}
