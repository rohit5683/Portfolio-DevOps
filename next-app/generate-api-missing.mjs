import fs from 'fs';
import path from 'path';

const APP_DIR = '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app/api';

// Create directories for new routes
const dirs = ['profile', 'profile/[id]', 'users', 'users/[id]', 'contact', 'upload/[type]'];
dirs.forEach(dir => fs.mkdirSync(path.join(APP_DIR, dir), { recursive: true }));

// 1. Profile
const profileRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne();
  return NextResponse.json(profile || {});
}

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const profile = await Profile.create(body);
  return NextResponse.json(profile);
}
`;
fs.writeFileSync(path.join(APP_DIR, 'profile', 'route.ts'), profileRoute);

const profileIdRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import { verifyAuth } from '@/lib/auth/jwt';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const profile = await Profile.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(profile);
}
`;
fs.writeFileSync(path.join(APP_DIR, 'profile', '[id]', 'route.ts'), profileIdRoute);

// 2. Users
const usersRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth/jwt';
import bcrypt from 'bcrypt';

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const users = await User.find({}).select('-passwordHash -refreshTokenHash');
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const authUser = await verifyAuth(req);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const passwordHash = await bcrypt.hash(body.password || 'changeme', 10);
  const newUser = await User.create({ ...body, passwordHash });
  return NextResponse.json({ message: 'User created' });
}
`;
fs.writeFileSync(path.join(APP_DIR, 'users', 'route.ts'), usersRoute);

const usersIdRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth/jwt';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
`;
fs.writeFileSync(path.join(APP_DIR, 'users', '[id]', 'route.ts'), usersIdRoute);

// 3. Contact
const contactRoute = `import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Placeholder for contact processing
  console.log('Received contact message:', body);
  return NextResponse.json({ success: true, message: 'Message sent' });
}
`;
fs.writeFileSync(path.join(APP_DIR, 'contact', 'route.ts'), contactRoute);

// 4. Upload
const uploadRoute = `import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/jwt';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  const user = await verifyAuth(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const type = params.type;
    const urls: string[] = [];

    // Simple local file upload mock logic
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    fs.mkdirSync(uploadDir, { recursive: true });

    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        const file = value as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = \`\${Date.now()}-\${file.name}\`;
        
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        urls.push(\`/uploads/\${type}/\${filename}\`);
      }
    }

    return NextResponse.json({ urls, url: urls[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
`;
fs.writeFileSync(path.join(APP_DIR, 'upload', '[type]', 'route.ts'), uploadRoute);

console.log('Missing API routes generated!');
