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

export default function Page() {
  return <Contact />;
}
