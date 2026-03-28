import fs from 'fs';
import path from 'path';

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('useNavigate') && content.includes('"next/navigation"')) {
        content = content.replace(/useNavigate,?/g, 'useRouter,');
        // Clean up redundant commas
        content = content.replace(/useRouter,\s*}/g, 'useRouter }');
        content = content.replace(/useRouter,\s*,/g, 'useRouter,');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

const dirs = [
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/page-components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app'
];

dirs.forEach(dir => fixImports(dir));
console.log("Fixed useNavigate imports!");
