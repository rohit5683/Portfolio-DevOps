import React from 'react';
import ExperienceEdit from '@/page-components/admin/ExperienceEdit';
import connectDB from '@/lib/db/mongoose';
import ExperienceModel from '@/lib/models/Experience';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const experience = await ExperienceModel.find({}).sort({ startDate: -1 }).lean();

  return <ExperienceEdit initialData={JSON.parse(JSON.stringify(experience))} />;
}
