import React from 'react';
import ExperienceComponent from '@/page-components/public/Experience';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import connectDB from '@/lib/db/mongoose';
import Experience from '@/lib/models/Experience';

export const metadata: Metadata = {
  title: `Experience | ${SITE_CONFIG.name}`,
  description: "A professional timeline of my roles and contributions in the DevOps and Cloud engineering space.",
  openGraph: {
    title: `Experience | ${SITE_CONFIG.shortName}`,
    description: "A professional timeline of my roles and contributions in the DevOps and Cloud engineering space.",
    url: `${SITE_CONFIG.url}/experience`,
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const experience = await Experience.find({}).sort({ createdAt: -1 }).limit(6).lean();

  return <ExperienceComponent initialExperience={JSON.parse(JSON.stringify(experience))} />;
}
