import mongoose from 'mongoose';

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

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);