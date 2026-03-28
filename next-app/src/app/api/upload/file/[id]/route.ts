import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import File from '@/lib/models/File';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const file = await File.findById(id);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return new NextResponse(file.data, {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': file.size.toString(),
        'Content-Disposition': `inline; filename="${encodeURIComponent(file.filename)}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
