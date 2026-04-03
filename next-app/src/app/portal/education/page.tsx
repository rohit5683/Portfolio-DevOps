import React from 'react';
import EducationEdit from '@/page-components/admin/EducationEdit';
import connectDB from '@/lib/db/mongoose';
import EducationModel from '@/lib/models/Education';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const education = await EducationModel.find({}).sort({ startDate: -1 }).lean();

  return <EducationEdit initialData={JSON.parse(JSON.stringify(education))} />;
}
