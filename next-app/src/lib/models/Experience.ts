import mongoose from 'mongoose';

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

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);