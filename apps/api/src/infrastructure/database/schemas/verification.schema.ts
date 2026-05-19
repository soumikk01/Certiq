import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'verifications' })
export class Verification {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  identifier!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export type VerificationDocument = Verification & Document;
export const VerificationSchema = SchemaFactory.createForClass(Verification);

VerificationSchema.index({ identifier: 1 });
VerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
