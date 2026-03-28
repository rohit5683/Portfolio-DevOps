import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  size: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.File || mongoose.model('File', FileSchema);