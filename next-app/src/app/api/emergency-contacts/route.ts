import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import EmergencyContact from '@/lib/models/EmergencyContact';
import { verifyAuth } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const contacts = await EmergencyContact.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await verifyAuth(request);
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const newContact = await EmergencyContact.create(body);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
