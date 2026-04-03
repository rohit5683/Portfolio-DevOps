import React from 'react';
import AboutEdit from '@/page-components/admin/AboutEdit';
import connectDB from '@/lib/db/mongoose';
import ProfileModel from '@/lib/models/Profile';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const profile = await ProfileModel.findOne({}).lean();

  return <AboutEdit initialData={JSON.parse(JSON.stringify(profile))} />;
}
