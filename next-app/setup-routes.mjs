import fs from 'fs';
import path from 'path';

const APP_DIR = '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/app';

const routes = [
  { path: '(public)', component: 'Home', isIndex: true, componentPath: '@/page-components/public/Home' },
  { path: '(public)/about', component: 'About', componentPath: '@/page-components/public/About' },
  { path: '(public)/skills', component: 'Skills', componentPath: '@/page-components/public/Skills' },
  { path: '(public)/projects', component: 'Projects', componentPath: '@/page-components/public/Projects' },
  { path: '(public)/experience', component: 'Experience', componentPath: '@/page-components/public/Experience' },
  { path: '(public)/education', component: 'Education', componentPath: '@/page-components/public/Education' },
  { path: '(public)/certifications', component: 'Certifications', componentPath: '@/page-components/public/Certifications' },
  { path: '(public)/contact', component: 'Contact', componentPath: '@/page-components/public/Contact' },

  { path: 'portal/login', component: 'Login', componentPath: '@/page-components/admin/Login' },
  { path: 'portal/totp-setup', component: 'TotpSetup', componentPath: '@/page-components/admin/TotpSetup' },

  { path: 'portal', component: 'Dashboard', isIndex: true, componentPath: '@/page-components/admin/Dashboard' },
  { path: 'portal/profile', component: 'ProfileEdit', componentPath: '@/page-components/admin/ProfileEdit' },
  { path: 'portal/about', component: 'AboutEdit', componentPath: '@/page-components/admin/AboutEdit' },
  { path: 'portal/projects', component: 'ProjectsEdit', componentPath: '@/page-components/admin/ProjectsEdit' },
  { path: 'portal/experience', component: 'ExperienceEdit', componentPath: '@/page-components/admin/ExperienceEdit' },
  { path: 'portal/education', component: 'EducationEdit', componentPath: '@/page-components/admin/EducationEdit' },
  { path: 'portal/skills', component: 'SkillsEdit', componentPath: '@/page-components/admin/SkillsEdit' },
  { path: 'portal/certifications', component: 'CertificationsEdit', componentPath: '@/page-components/admin/CertificationsEdit' },
  { path: 'portal/users', component: 'UserManagement', componentPath: '@/page-components/admin/UserManagement' }
];

// Clean existing app dir if standard page.tsx exists
if (fs.existsSync(path.join(APP_DIR, 'page.tsx'))) {
  fs.rmSync(path.join(APP_DIR, 'page.tsx'));
}

for (const route of routes) {
  const dirPath = path.join(APP_DIR, route.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const fileContent = `"use client";
import React from 'react';
import ${route.component} from '${route.componentPath}';

export default function Page() {
  return <${route.component} />;
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), fileContent);
}

console.log("Routes generated successfully!");
