import React from 'react';
import Projects from '@/page-components/public/Projects';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Projects | ${SITE_CONFIG.name}`,
  description: "Explore my DevOps projects, focusing on AWS architecture, Kubernetes automation, and CI/CD pipelines.",
  openGraph: {
    title: `Projects | ${SITE_CONFIG.shortName}`,
    description: "Explore my DevOps projects, focusing on AWS architecture, Kubernetes automation, and CI/CD pipelines.",
    url: `${SITE_CONFIG.url}/projects`,
  },
};

export default function Page() {
  return <Projects />;
}
