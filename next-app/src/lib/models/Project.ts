import mongoose from 'mongoose';

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

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);