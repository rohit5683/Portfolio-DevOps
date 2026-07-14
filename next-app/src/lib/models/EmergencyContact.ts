import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact extends Document {
  name: string;
  phone: string;
  relation: string;
  order: number;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, required: true },
    phone: { 
      type: String, 
      required: true,
      match: [/^\+?[0-9\s\-()]{7,15}$/, 'Please enter a valid mobile number']
    },
    relation: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.EmergencyContact || mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
