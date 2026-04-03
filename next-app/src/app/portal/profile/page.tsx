import React from 'react';
import ProfileEdit from '@/page-components/admin/ProfileEdit';
import connectDB from '@/lib/db/mongoose';
import ProfileModel from '@/lib/models/Profile';
import SkillModel from '@/lib/models/Skill';

export const revalidate = 0;

export default async function Page() {
  await connectDB();
  const [profile, skills] = await Promise.all([
    ProfileModel.findOne({}).lean(),
    SkillModel.find({}).sort({ name: 1 }).lean(),
  ]);

  return (
    <ProfileEdit 
      initialData={JSON.parse(JSON.stringify(profile))} 
      initialSkills={JSON.parse(JSON.stringify(skills))}
    />
  );
}
