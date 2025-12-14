import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExperienceDocument = Experience & Document;

@Schema()
export class Experience {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date; // Null for current

  @Prop()
  description: string;

  @Prop()
  companyLogo: string; // URL to company logo

  @Prop([String])
  techStack: string[]; // Technologies used in this role

  @Prop([String])
  achievements: string[]; // Key accomplishments

  @Prop([String])
  challenges: string[]; // Key challenges faced

  @Prop()
  roleDescription: string; // Detailed description of the role

  @Prop()
  location: string; // Job location (e.g., "Remote", "New York, NY")
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
