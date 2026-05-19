import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'certificates' })
export class Certificate {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  issuer!: string;

  @Prop({ default: null })
  objectKey!: string | null;

  @Prop({ default: null })
  credUrl!: string | null;

  @Prop({ default: false })
  verified!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export type CertificateDocument = Certificate & Document;
export const CertificateSchema = SchemaFactory.createForClass(Certificate);

CertificateSchema.index({ userId: 1 });
