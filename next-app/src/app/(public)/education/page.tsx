import React from 'react';
import Education from '@/page-components/public/Education';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import connectDB from '@/lib/db/mongoose';
import EducationModel from '@/lib/models/Education';

export const metadata: Metadata = {
  title: `Education & Training | ${SITE_CONFIG.name} - DevOps Engineer`,
  description: "Academic background and professional training in Computer Science and Cloud Computing. Certified in AWS and modern DevOps practices.",
  openGraph: {
    title: `Education | ${SITE_CONFIG.shortName} - Academic Background`,
    description: "Academic background and professional training in Computer Science and Cloud Computing.",
    url: `${SITE_CONFIG.url}/education`,
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const education = await EducationModel.find({}).sort({ endDate: -1 }).limit(6).lean();

  return <Education initialEducation={JSON.parse(JSON.stringify(education))} />;
}
