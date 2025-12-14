import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificationDocument = Certification & Document;

@Schema()
export class Certification {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['Certification', 'Internship', 'Course', 'Award'],
    default: 'Certification',
  })
  type: string;

  @Prop({ required: true })
  issuer: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  credentialUrl: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  description: string;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
