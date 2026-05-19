import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'resumes' })
export class Resume {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ default: 'Untitled Resume' })
  title!: string;

  @Prop({ default: 'executive' })
  templateId!: string;

  @Prop({ type: Object, default: {} })
  content!: Record<string, unknown>;

  @Prop({ default: false })
  published!: boolean;

  @Prop({ default: null, unique: true, sparse: true })
  shareSlug!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export type ResumeDocument = Resume & Document;
export const ResumeSchema = SchemaFactory.createForClass(Resume);

ResumeSchema.index({ userId: 1 });
ResumeSchema.index({ shareSlug: 1 }, { unique: true, sparse: true });
