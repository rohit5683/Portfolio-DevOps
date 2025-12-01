import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  refreshTokenHash?: string;

  @Prop({ default: true })
  mfaEnabled: boolean;

  @Prop({ default: 'email' }) // 'email' or 'totp'
  mfaMethod: string;

  @Prop()
  totpSecret?: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
