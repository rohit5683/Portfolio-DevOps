import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walk(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function transformClasses(classString) {
  // If this contains solid colored backgrounds for buttons, skip text color inversion
  const hasSolidBlueOrGradient = /bg-gradient|from-blue|bg-blue-600|bg-blue-500|bg-blue-700|bg-green-600|bg-orange-600|bg-purple-600|bg-indigo-600/.test(classString);

  let newStr = classString;

  // Replacements Map
  const replacements = [
    [/\bbg-white\/5\b/g, 'bg-black/5 dark:bg-white/5'],
    [/\bbg-white\/10\b/g, 'bg-black/10 dark:bg-white/10'],
    [/\bbg-white\/20\b/g, 'bg-black/20 dark:bg-white/20'],
    [/\bborder-white\/5\b/g, 'border-black/5 dark:border-white/5'],
    [/\bborder-white\/10\b/g, 'border-black/10 dark:border-white/10'],
    [/\bborder-white\/20\b/g, 'border-black/20 dark:border-white/20'],
    [/\bbg-\[#1e1e1e\]\b/g, 'bg-white dark:bg-[#1e1e1e]'],
    [/\bbg-\[#2d2d2d\]\b/g, 'bg-slate-100 dark:bg-[#2d2d2d]'],
    [/\bbg-black\/80\b/g, 'bg-white/80 dark:bg-black/80'],
    [/\bbg-black\/40\b/g, 'bg-white/40 dark:bg-black/40'],
    [/\bbg-black\/60\b/g, 'bg-white/60 dark:bg-black/60'],
    
    // Hover states
    [/\bhover:bg-white\/10\b/g, 'hover:bg-black/10 dark:hover:bg-white/10'],
    [/\bhover:bg-white\/20\b/g, 'hover:bg-black/20 dark:hover:bg-white/20'],
    [/\bhover:border-white\/20\b/g, 'hover:border-black/20 dark:hover:border-white/20'],
    [/\bgroup-hover:text-white\b/g, 'group-hover:text-slate-900 dark:group-hover:text-white'],
    [/\bhover:text-white\b/g, 'hover:text-slate-900 dark:hover:text-white'],
  ];

  if (!hasSolidBlueOrGradient) {
    replacements.push([/\btext-white\b/g, 'text-slate-900 dark:text-white']);
    replacements.push([/\btext-gray-300\b/g, 'text-slate-600 dark:text-gray-300']);
    replacements.push([/\btext-gray-400\b/g, 'text-slate-500 dark:text-gray-400']);
  }

  for (const [regex, replacement] of replacements) {
    newStr = newStr.replace(regex, replacement);
  }

  return newStr;
}

const DIRS = [
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/page-components',
  '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app'
];

DIRS.forEach(dir => {
  walk(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Regex to find className="..." or className={\`...\`}
      const classNameRegex = /className=["'\`]([^"'\`]+)["'\`]/g;
      let match;
      let newContent = content;
      let changed = false;

      // Iteratively replace the className strings
      newContent = newContent.replace(classNameRegex, (match, p1) => {
        const transformed = transformClasses(p1);
        if (transformed !== p1) {
          changed = true;
          return match.replace(p1, transformed);
        }
        return match;
      });
      
      if (changed) {
        fs.writeFileSync(filePath, newContent);
      }
    }
  });
});

console.log("Codemod applied successfully!");
