import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SkillDocument = Skill & Document;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true })
  name: string;

  @Prop()
  iconUrl: string;

  @Prop({ default: 'tools' })
  category: string; // 'cloud', 'devops', 'programming', 'database', 'tools'

  @Prop({ default: 75 })
  proficiency: number; // 0-100

  @Prop({ default: 0 })
  yearsOfExperience: number;

  @Prop({ default: false })
  featured: boolean;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
