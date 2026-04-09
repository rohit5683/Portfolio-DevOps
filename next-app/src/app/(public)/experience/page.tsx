import React from 'react';
import ExperienceComponent from '@/page-components/public/Experience';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import connectDB from '@/lib/db/mongoose';
import Experience from '@/lib/models/Experience';

export const metadata: Metadata = {
  title: `Professional Experience | ${SITE_CONFIG.name} - DevOps & SRE`,
  description: "Professional journey of Rohit Vishwakarma as a DevOps Engineer and Cloud Architect, featuring roles in infrastructure management, CI/CD, and automation.",
  openGraph: {
    title: `Experience | ${SITE_CONFIG.shortName} - Career Journey`,
    description: "Professional journey of Rohit Vishwakarma as a DevOps Engineer and Cloud Architect, featuring roles in infrastructure management, CI/CD, and automation.",
    url: `${SITE_CONFIG.url}/experience`,
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const experience = await Experience.find({}).sort({ createdAt: -1 }).limit(6).lean();

  return <ExperienceComponent initialExperience={JSON.parse(JSON.stringify(experience))} />;
}
