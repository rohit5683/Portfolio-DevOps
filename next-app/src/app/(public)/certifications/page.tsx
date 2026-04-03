import React from 'react';
import Certifications from '@/page-components/public/Certifications';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import connectDB from '@/lib/db/mongoose';
import Certification from '@/lib/models/Certification';

export const metadata: Metadata = {
  title: `Certifications | ${SITE_CONFIG.name}`,
  description: "Professional certifications and internship history in DevOps and Cloud engineering.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const certifications = await Certification.find({}).sort({ createdAt: -1 }).lean();

  return <Certifications initialCertifications={JSON.parse(JSON.stringify(certifications))} />;
}
