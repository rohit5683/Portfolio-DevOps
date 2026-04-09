import React from 'react';
import Projects from '@/page-components/public/Projects';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';

export const metadata: Metadata = {
  title: `DevOps Projects | ${SITE_CONFIG.name}`,
  description: "Explore my DevOps and Cloud projects, focusing on AWS architecture, Kubernetes automation, DevSecOps, and scalable CI/CD pipelines.",
  openGraph: {
    title: `Projects | ${SITE_CONFIG.shortName} - Cloud & DevOps Portfolio`,
    description: "Explore my DevOps and Cloud projects, focusing on AWS architecture, Kubernetes automation, DevSecOps, and scalable CI/CD pipelines.",
    url: `${SITE_CONFIG.url}/projects`,
  },
};

import connectDB from '@/lib/db/mongoose';
import Project from '@/lib/models/Project';
import { getImageUrl } from '@/utils/imageUtils';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
  await connectDB();
  const rawProjects = await Project.find({}).sort({ createdAt: -1 }).limit(6).lean();
  
  const projects = rawProjects.map((p: any) => ({
    ...p,
    images: Array.isArray(p?.images) ? p.images.map(getImageUrl) : [],
  }));

  return <Projects initialProjects={JSON.parse(JSON.stringify(projects))} />;
}
