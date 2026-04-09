import React from 'react';
import Contact from '@/page-components/public/Contact';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Contact | ${SITE_CONFIG.name} - Hire for DevOps & Cloud`,
  description: "Get in touch with Rohit Vishwakarma for DevOps consulting, cloud architecture audits, or remote freelance opportunities in Pune and globally.",
  openGraph: {
    title: `Contact | ${SITE_CONFIG.shortName} - Get in Touch`,
    description: "Get in touch with Rohit Vishwakarma for DevOps consulting, cloud architecture audits, or remote freelance opportunities.",
    url: `${SITE_CONFIG.url}/contact`,
  },
};

import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const profile = await Profile.findOne().lean();

  return <Contact initialProfile={JSON.parse(JSON.stringify(profile))} />;
}
