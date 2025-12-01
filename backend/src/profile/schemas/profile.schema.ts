import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true })
  ownerId: string; // Link to User

  @Prop()
  name: string;

  @Prop()
  role: string;

  @Prop()
  tagline: string;

  @Prop()
  headline: string;

  @Prop()
  about: string;

  @Prop()
  photoUrl: string;

  @Prop({ type: Object })
  contact: {
    email: string;
    phone?: string;
    github: string;
    linkedin?: string;
    twitter?: string;
  };

  @Prop([String])
  roles: string[];

  @Prop([{ type: Object }])
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;

  @Prop([{ type: Object }])
  highlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  @Prop([{ type: Object }])
  animatedStats: Array<{
    label: string;
    value: number;
    icon: string;
  }>;

  @Prop([{ type: Object }])
  badges: Array<{
    text: string;
    color: string;
    icon: string;
    position: string;
  }>;

  @Prop()
  aboutSubtitle: string;

  @Prop()
  location: string;

  @Prop({ type: Object })
  availability: {
    status: string;
    message: string;
  };

  @Prop({ type: Object })
  settings: {
    theme: string;
    prefersReducedMotion: boolean;
  };
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
