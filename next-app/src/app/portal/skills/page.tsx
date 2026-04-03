import React from 'react';
import SkillsEdit from '@/page-components/admin/SkillsEdit';
import connectDB from '@/lib/db/mongoose';
import SkillModel from '@/lib/models/Skill';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const skills = await SkillModel.find({}).sort({ name: 1 }).lean();

  return <SkillsEdit initialData={JSON.parse(JSON.stringify(skills))} />;
}
