import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EducationDocument = Education & Document;

@Schema({ timestamps: true })
export class Education {
  @Prop({ required: true })
  schoolCollege: string;

  @Prop({ required: true })
  boardUniversity: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  fieldOfStudy: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop()
  grade: string;

  @Prop({ default: 'Percentage' })
  gradeType: string; // 'Percentage' or 'GPA'

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop([String])
  documents: string[]; // URLs to certificates, degrees, etc.

  @Prop({ default: 'undergraduate' })
  level: string; // 'high-school', 'undergraduate', 'postgraduate', 'certification'

  @Prop({ default: 'completed' })
  status: string; // 'completed', 'in-progress', 'dropped'

  @Prop({ default: false })
  featured: boolean; // Highlight important education
}

export const EducationSchema = SchemaFactory.createForClass(Education);
