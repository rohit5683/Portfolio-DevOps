import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth/jwt';

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { pin } = body;

    if (!pin || pin.length !== 4) {
      return NextResponse.json({ error: 'A 4-digit PIN is required' }, { status: 400 });
    }

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    admin.emergencyPin = pin;
    await admin.save();

    return NextResponse.json({ message: 'PIN updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
