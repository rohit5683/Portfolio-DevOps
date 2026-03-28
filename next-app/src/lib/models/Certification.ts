import mongoose from 'mongoose';

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Certification', 'Internship', 'Course', 'Award'], default: 'Certification' },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  credentialUrl: { type: String },
  fileUrl: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);