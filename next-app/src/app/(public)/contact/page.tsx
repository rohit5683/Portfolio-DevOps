import React from 'react';
import Contact from '@/page-components/public/Contact';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Contact | ${SITE_CONFIG.name}`,
  description: "Get in touch with Rohit Vishwakarma for DevOps consulting, cloud architecture, or collaboration opportunities.",
  openGraph: {
    title: `Contact | ${SITE_CONFIG.shortName}`,
    description: "Get in touch with Rohit Vishwakarma for DevOps consulting, cloud architecture, or collaboration opportunities.",
    url: `${SITE_CONFIG.url}/contact`,
  },
};

export default function Page() {
  return <Contact />;
}
