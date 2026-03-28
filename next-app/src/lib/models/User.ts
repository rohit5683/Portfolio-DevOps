import mongoose from 'mongoose';

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

export default mongoose.models.User || mongoose.model('User', UserSchema);