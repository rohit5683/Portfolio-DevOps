import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne();
  return NextResponse.json(profile || {});
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const profile = await Profile.create(body);
  return NextResponse.json(profile);
}
