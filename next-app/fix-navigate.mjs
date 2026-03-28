import fs from 'fs';
import path from 'path';

function fixNavigate(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixNavigate(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix instances where navigate() is called like a function instead of object
      // Regex matches `navigate(` followed by anything except `.push` or `.replace`
      if (content.includes('navigate(')) {
        // e.g. navigate("/login") -> navigate.push("/login")
        content = content.replace(/navigate\(([^)]*)\)/g, 'navigate.push($1)');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

const dirs = [
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/page-components',
];

dirs.forEach(dir => fixNavigate(dir));
console.log("Fixed navigate function calls!");
