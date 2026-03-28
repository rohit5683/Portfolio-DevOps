import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth/jwt';
import bcrypt from 'bcrypt';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authUser = await verifyAuth(req);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await connectDB();
  const body = await req.json();
  const { password, mfaEnabled, mfaMethod } = body;
  
  const updates: any = {};
  if (password) updates.passwordHash = await bcrypt.hash(password, 10);
  if (mfaEnabled !== undefined) updates.mfaEnabled = mfaEnabled;
  if (mfaMethod) updates.mfaMethod = mfaMethod;

  const item = await User.findByIdAndUpdate((await params).id, updates, { new: true });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json({ success: true, message: 'User updated' });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  await User.findByIdAndDelete((await params).id);
  return NextResponse.json({ success: true });
}
