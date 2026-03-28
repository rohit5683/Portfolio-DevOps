import fs from 'fs';
import path from 'path';

function addUseClient(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      addUseClient(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      // Don't modify Next.js app directory files or index.css
      if (fullPath.includes('/app/') && (file === 'layout.tsx' || file === 'page.tsx')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        fs.writeFileSync(fullPath, '"use client";\n' + content);
      }
    }
  }
}

const dirs = [
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/context',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/hooks',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/page-components'
];

dirs.forEach(dir => addUseClient(dir));
console.log("Added use client directives!");
