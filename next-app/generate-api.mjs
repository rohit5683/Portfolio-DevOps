import fs from 'fs';
import path from 'path';

const APP_DIR = '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app/api';

const modules = [
  { path: 'projects', modelName: 'Project' },
  { path: 'experience', modelName: 'Experience' },
  { path: 'education', modelName: 'Education' },
  { path: 'skills', modelName: 'Skill' },
  { path: 'certifications', modelName: 'Certification' },
];

for (const mod of modules) {
  const modDir = path.join(APP_DIR, mod.path);
  const idDir = path.join(modDir, '[id]');
  
  fs.mkdirSync(idDir, { recursive: true });

  // route.ts (GET all, POST)
  const collectionRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ${mod.modelName} from '@/lib/models/${mod.modelName}';
import { verifyAuth } from '@/lib/auth/jwt';

export async function GET() {
  try {
    await connectDB();
    const items = await ${mod.modelName}.find({}).sort({ createdAt: -1 });
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
    const item = await ${mod.modelName}.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
`;

  // [id]/route.ts (GET one, PUT, DELETE)
  const idRoute = `import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import ${mod.modelName} from '@/lib/models/${mod.modelName}';
import { verifyAuth } from '@/lib/auth/jwt';

export async function GET({ params }: { params: { id: string } }) {
  try {
    await connectDB();
    const item = await ${mod.modelName}.findById(params.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const item = await ${mod.modelName}.findByIdAndUpdate(params.id, body, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const item = await ${mod.modelName}.findByIdAndDelete(params.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
`;

  fs.writeFileSync(path.join(modDir, 'route.ts'), collectionRoute);
  fs.writeFileSync(path.join(idDir, 'route.ts'), idRoute);
}

console.log("API routes generated!");
