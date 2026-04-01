import React from 'react';
import Education from '@/page-components/public/Education';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Education | ${SITE_CONFIG.name}`,
  description: "Academic background, degrees, and professional certifications in DevOps and Computer Science.",
  openGraph: {
    title: `Education | ${SITE_CONFIG.shortName}`,
    description: "Academic background, degrees, and professional certifications in DevOps and Computer Science.",
    url: `${SITE_CONFIG.url}/education`,
  },
};

export default function Page() {
  return <Education />;
}
