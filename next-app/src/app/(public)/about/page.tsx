import React from 'react';
import About from '@/page-components/public/About';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `About | ${SITE_CONFIG.name} - DevOps Engineer in Pune`,
  description: "Learn more about Rohit Vishwakarma, a DevOps Engineer and Freelancer in Pune dedicated to streamlining development workflows, Kubernetes automation, and managing cloud infrastructure.",
  openGraph: {
    title: `About | ${SITE_CONFIG.shortName} - DevOps & Cloud Architect`,
    description: "Learn more about Rohit Vishwakarma, a DevOps Engineer and Freelancer in Pune dedicated to streamlining development workflows, Kubernetes automation, and managing cloud infrastructure.",
    url: `${SITE_CONFIG.url}/about`,
  },
};

import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import Experience from '@/lib/models/Experience';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const [profile, experience] = await Promise.all([
    Profile.findOne({}).lean(),
    Experience.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  return <About initialProfile={JSON.parse(JSON.stringify(profile))} initialExperience={JSON.parse(JSON.stringify(experience))} />;
}
