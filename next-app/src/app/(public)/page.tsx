import React from 'react';
import Home from '@/page-components/public/Home';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import SchemaOrg from '@/components/common/SchemaOrg';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} | DevOps Engineer & Freelancer Portfolio`,
  description: SITE_CONFIG.description,
  keywords: [
    ...SITE_CONFIG.keywords,
    "DevOps Pune",
    "Azure DevOps Engineer",
    "Infrastructure Automation Freelancer"
  ],
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImage }],
    type: 'website',
  },
};

import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import Skill from '@/lib/models/Skill';
import Experience from '@/lib/models/Experience';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  
  // Fetch all required data in parallel on the server
  const [profile, allSkills, experience] = await Promise.all([
    Profile.findOne().lean(),
    Skill.find({}).sort({ createdAt: -1 }).lean(),
    Experience.find({}).sort({ createdAt: -1 }).lean()
  ]);

  const featuredSkills = allSkills.filter((skill: any) => skill.featured);

  return (
    <>
      <SchemaOrg type="Person" data={JSON.parse(JSON.stringify(profile))} />
      <Home 
        initialProfile={JSON.parse(JSON.stringify(profile))} 
        initialSkills={JSON.parse(JSON.stringify(featuredSkills))} 
        initialExperience={JSON.parse(JSON.stringify(experience))} 
      />
    </>
  );
}
