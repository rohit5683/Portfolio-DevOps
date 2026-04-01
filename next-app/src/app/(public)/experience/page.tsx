import React from 'react';
import Experience from '@/page-components/public/Experience';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Experience | ${SITE_CONFIG.name}`,
  description: "A professional timeline of my roles and contributions in the DevOps and Cloud engineering space.",
  openGraph: {
    title: `Experience | ${SITE_CONFIG.shortName}`,
    description: "A professional timeline of my roles and contributions in the DevOps and Cloud engineering space.",
    url: `${SITE_CONFIG.url}/experience`,
  },
};

export default function Page() {
  return <Experience />;
}
