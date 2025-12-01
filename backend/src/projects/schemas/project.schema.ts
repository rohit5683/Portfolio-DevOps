import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop([String])
  techStack: string[];

  @Prop([String])
  images: string[];

  @Prop()
  link: string;

  @Prop()
  githubLink: string;

  @Prop({ default: 'completed' })
  status: string; // 'completed', 'in-progress', 'archived'

  @Prop({ default: false })
  featured: boolean; // Highlight important projects

  @Prop({ default: 'web' })
  category: string; // 'web', 'devops', 'cloud', 'mobile', etc.

  @Prop()
  completionDate: Date; // When project was finished
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
