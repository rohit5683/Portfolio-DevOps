import React from 'react';
import Skills from '@/page-components/public/Skills';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `Technical Skills | ${SITE_CONFIG.name} - DevOps & Cloud Expert`,
  description: "Advanced technical skills and proficiencies in AWS, Kubernetes, Terraform, Jenkins, DevSecOps, and Cloud Infrastructure Automation.",
  openGraph: {
    title: `Skills | ${SITE_CONFIG.shortName} - DevOps & Cloud Mastery`,
    description: "Advanced technical skills and proficiencies in AWS, Kubernetes, Terraform, Jenkins, DevSecOps, and Cloud Infrastructure Automation.",
    url: `${SITE_CONFIG.url}/skills`,
  },
};

import connectDB from '@/lib/db/mongoose';
import Skill from '@/lib/models/Skill';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const skills = await Skill.find({}).sort({ createdAt: -1 }).limit(6).lean();

  return <Skills initialSkills={JSON.parse(JSON.stringify(skills))} />;
}
