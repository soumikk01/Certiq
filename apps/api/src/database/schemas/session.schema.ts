import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'sessions' })
export class Session {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  token!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ default: null })
  ipAddress!: string | null;

  @Prop({ default: null })
  userAgent!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ token: 1 }, { unique: true });
SessionSchema.index({ userId: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
