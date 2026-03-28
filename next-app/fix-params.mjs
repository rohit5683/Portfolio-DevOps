import fs from 'fs';
import path from 'path';

function fixParams(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixParams(fullPath);
    } else if (fullPath.endsWith('route.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      
      // Fix GET({ params })
      if (content.includes('export async function GET({ params }: { params: { id: string } })')) {
        content = content.replace(
          'export async function GET({ params }: { params: { id: string } })',
          'export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> })'
        );
        content = content.replace('params.id', '(await params).id');
        changed = true;
      }
      
      // Fix PUT(req, { params })
      if (content.includes('export async function PUT(req: NextRequest, { params }: { params: { id: string } })')) {
        content = content.replace(
          'export async function PUT(req: NextRequest, { params }: { params: { id: string } })',
          'export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> })'
        );
        content = content.replace('params.id', '(await params).id');
        changed = true;
      }
      
      // Fix DELETE(req, { params })
      if (content.includes('export async function DELETE(req: NextRequest, { params }: { params: { id: string } })')) {
        content = content.replace(
          'export async function DELETE(req: NextRequest, { params }: { params: { id: string } })',
          'export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> })'
        );
        content = content.replace('params.id', '(await params).id');
        changed = true;
      }
      
      // Fix POST(..., { params: { type: string } })
      if (content.includes('export async function POST(req: NextRequest, { params }: { params: { type: string } })')) {
        content = content.replace(
          'export async function POST(req: NextRequest, { params }: { params: { type: string } })',
          'export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> })'
        );
        content = content.replace('params.type', '(await params).type');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixParams('/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app/api');
console.log("Fixed route params!");
