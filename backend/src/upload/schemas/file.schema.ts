import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  contentType: string;

  @Prop({ required: true })
  data: Buffer;

  @Prop({ required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
