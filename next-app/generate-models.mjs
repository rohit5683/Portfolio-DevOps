import fs from 'fs';
import path from 'path';

const modelsDir = '/home/sys1/Downloads/Code/Portfolio-DevOps/next-app/src/lib/models';
fs.mkdirSync(modelsDir, { recursive: true });

const models = {
  'Project.ts': `import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  images: [{ type: String }],
  link: { type: String },
  githubLink: { type: String },
  status: { type: String, default: 'completed' },
  featured: { type: Boolean, default: false },
  category: { type: String, default: 'web' },
  completionDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);`,

  'User.ts': `import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },
  refreshTokenHash: { type: String },
  mfaEnabled: { type: Boolean, default: true },
  mfaMethod: { type: String, default: 'email' },
  totpSecret: { type: String },
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);`,

  'Education.ts': `import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  schoolCollege: { type: String, required: true },
  boardUniversity: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  grade: { type: String },
  gradeType: { type: String, default: 'Percentage' },
  description: { type: String },
  logoUrl: { type: String },
  documents: [{ type: String }],
  level: { type: String, default: 'undergraduate' },
  status: { type: String, default: 'completed' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Education || mongoose.model('Education', EducationSchema);`,

  'Experience.ts': `import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String },
  companyLogo: { type: String },
  techStack: [{ type: String }],
  achievements: [{ type: String }],
  challenges: [{ type: String }],
  roleDescription: { type: String },
  location: { type: String }
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);`,

  'Skill.ts': `import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconUrl: { type: String },
  category: { type: String, default: 'tools' },
  proficiency: { type: Number, default: 75 },
  yearsOfExperience: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);`,

  'Certification.ts': `import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Certification', 'Internship', 'Course', 'Award'], default: 'Certification' },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  credentialUrl: { type: String },
  fileUrl: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);`,

  'File.ts': `import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  size: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.File || mongoose.model('File', FileSchema);`,

  'Profile.ts': `import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  name: { type: String },
  role: { type: String },
  tagline: { type: String },
  headline: { type: String },
  about: { type: String },
  photoUrl: { type: String },
  contact: { type: Object },
  roles: [{ type: String }],
  stats: [{ type: Object }],
  highlights: [{ type: Object }],
  animatedStats: [{ type: Object }],
  badges: [{ type: Object }],
  achievements: [{ type: Object }],
  aboutSubtitle: { type: String },
  location: { type: String },
  availability: { type: Object },
  settings: { type: Object }
}, { timestamps: true });

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}
console.log("Mongoose models generated!");
