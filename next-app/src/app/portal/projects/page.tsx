import React from 'react';
import ProjectsEdit from '@/page-components/admin/ProjectsEdit';
import connectDB from '@/lib/db/mongoose';
import ProjectModel from '@/lib/models/Project';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const projects = await ProjectModel.find({}).sort({ createdAt: -1 }).lean();

  return <ProjectsEdit initialData={JSON.parse(JSON.stringify(projects))} />;
}
