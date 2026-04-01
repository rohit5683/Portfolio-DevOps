import React from 'react';
import About from '@/page-components/public/About';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `About | ${SITE_CONFIG.name}`,
  description: "Learn more about Rohit Vishwakarma, a DevOps Engineer dedicated to streamlining development workflows and managing cloud infrastructure.",
  openGraph: {
    title: `About | ${SITE_CONFIG.shortName}`,
    description: "Learn more about Rohit Vishwakarma, a DevOps Engineer dedicated to streamlining development workflows and managing cloud infrastructure.",
    url: `${SITE_CONFIG.url}/about`,
  },
};

export default function Page() {
  return <About />;
}
