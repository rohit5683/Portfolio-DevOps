import React from 'react';
import Skills from '@/page-components/public/Skills';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Skills | ${SITE_CONFIG.name}`,
  description: "Technical skills and proficiencies in AWS, Kubernetes, Terraform, Jenkins, and more.",
  openGraph: {
    title: `Skills | ${SITE_CONFIG.shortName}`,
    description: "Technical skills and proficiencies in AWS, Kubernetes, Terraform, Jenkins, and more.",
    url: `${SITE_CONFIG.url}/skills`,
  },
};

export default function Page() {
  return <Skills />;
}
