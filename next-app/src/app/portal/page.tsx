import React from 'react';
import Dashboard from '@/page-components/admin/Dashboard';
import connectDB from '@/lib/db/mongoose';
import ProfileModel from '@/lib/models/Profile';
import ProjectModel from '@/lib/models/Project';
import SkillModel from '@/lib/models/Skill';
import ExperienceModel from '@/lib/models/Experience';
import EducationModel from '@/lib/models/Education';
import CertificationModel from '@/lib/models/Certification';

export const revalidate = 0; // Admin dashboard should always be fresh

export default async function Page() {
  await connectDB();
  
  const [profile, projectsCount, skillsCount, experienceCount, educationCount, certificationCount] = await Promise.all([
    ProfileModel.findOne({}).select('name role').lean(),
    ProjectModel.countDocuments({}),
    SkillModel.countDocuments({}),
    ExperienceModel.countDocuments({}),
    EducationModel.countDocuments({}),
    CertificationModel.countDocuments({}),
  ]);

  const initialStats = {
    name: profile?.name || "Admin",
    role: profile?.role || "Developer",
    projects: projectsCount,
    skills: skillsCount,
    experience: experienceCount,
    education: educationCount,
    certifications: certificationCount,
  };

  return <Dashboard initialStats={JSON.parse(JSON.stringify(initialStats))} />;
}
