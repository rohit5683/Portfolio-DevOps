import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Skill from '@/lib/models/Skill';
import { verifyAuth } from '@/lib/auth/jwt';

export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = req.nextUrl?.searchParams || new URL(req.url).searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    let query = Skill.find({}).sort({ proficiency: -1, name: 1 });
    if (limit > 0) {
      query = query.skip((page - 1) * limit).limit(limit);
    }
    
    const items = await query.lean();
    
    if (limit > 0) {
      const total = await Skill.countDocuments({});
      const response = NextResponse.json(items);
      response.headers.set('x-total-count', total.toString());
      return response;
    }
    
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const item = await Skill.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
