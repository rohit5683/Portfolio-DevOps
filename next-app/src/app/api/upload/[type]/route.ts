import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongoose';
import File from '@/lib/models/File';

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const formData = await req.formData();
    const urls: string[] = [];

    for (const [, value] of formData.entries()) {
      if (value instanceof Blob) {
        const file = value as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const savedFile = await (File as any).create({
          filename: file.name,
          contentType: file.type,
          data: buffer,
          size: file.size,
        });

        const url = `/upload/file/${savedFile._id}/${encodeURIComponent(file.name)}`;
        urls.push(url);
      }
    }

    return NextResponse.json({ urls, url: urls[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

