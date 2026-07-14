import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import EmergencyContact from '@/lib/models/EmergencyContact';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { pin } = body;

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    // Find the primary user (admin)
    const admin = await User.findOne({ role: 'admin' });
    
    // If no admin exists yet or PIN doesn't match the admin's pin
    if (!admin || admin.emergencyPin !== pin) {
      // Fallback: If no admin exists, we can still allow '0000' for demo purposes, 
      // but otherwise it rejects. Let's just enforce the check.
      if (!admin && pin === '0000') {
         // Allow for first-time setup when no admin exists
      } else if (!admin || admin.emergencyPin !== pin) {
         return NextResponse.json({ error: 'Unauthorized: Incorrect PIN' }, { status: 401 });
      }
    }

    // PIN is correct, fetch contacts
    const contacts = await EmergencyContact.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
