import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Profile from '@/lib/models/Profile';
import Project from '@/lib/models/Project';
import Skill from '@/lib/models/Skill';
import Experience from '@/lib/models/Experience';
import Education from '@/lib/models/Education';
import Certification from '@/lib/models/Certification';

export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();

    const [
      profile,
      projectsCount,
      skillsCount,
      experienceCount,
      educationCount,
      certificationsCount
    ] = await Promise.all([
      Profile.findOne({}).lean(),
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Certification.countDocuments()
    ]);

    return NextResponse.json({
      name: profile?.name || "Admin",
      role: profile?.role || "Developer",
      projects: projectsCount,
      skills: skillsCount,
      experience: experienceCount,
      education: educationCount,
      certifications: certificationsCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
