import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id } = await params;
  const { _id, ...updateData } = body;
  let profile;
  if (id && id !== 'undefined' && id !== 'null' && id.length === 24) {
    profile = await Profile.findByIdAndUpdate(id, updateData, { new: true, upsert: true });
  } else {
    profile = await Profile.findOneAndUpdate({}, updateData, { new: true, upsert: true });
  }
  return NextResponse.json(profile);
}

