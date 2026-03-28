import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const profile = await Profile.findByIdAndUpdate((await params).id, body, { new: true });
  return NextResponse.json(profile);
}
