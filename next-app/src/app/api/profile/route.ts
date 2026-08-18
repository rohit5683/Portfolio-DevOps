import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().lean();
  return NextResponse.json(profile || {});
}

export async function PUT(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { _id, ...updateData } = body;
  const profile = await Profile.findOneAndUpdate({}, updateData, { new: true, upsert: true, setDefaultsOnInsert: true });
  return NextResponse.json(profile);
}

