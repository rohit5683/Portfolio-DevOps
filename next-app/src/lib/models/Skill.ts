import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconUrl: { type: String },
  category: { type: String, default: 'tools' },
  proficiency: { type: Number, default: 75 },
  yearsOfExperience: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);