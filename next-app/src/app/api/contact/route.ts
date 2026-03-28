import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/services/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await sendContactEmail(body);
    return NextResponse.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
