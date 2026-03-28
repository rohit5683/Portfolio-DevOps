import mongoose from 'mongoose';

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

export default mongoose.models.Education || mongoose.model('Education', EducationSchema);