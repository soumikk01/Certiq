import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'accounts' })
export class Account {
  _id!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  providerId!: string;

  @Prop({ required: true })
  accountId!: string;

  @Prop({ default: null })
  accessToken!: string | null;

  @Prop({ default: null })
  refreshToken!: string | null;

  @Prop({ default: null })
  accessTokenExpiresAt!: Date | null;

  @Prop({ default: null })
  refreshTokenExpiresAt!: Date | null;

  @Prop({ default: null })
  password!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export type AccountDocument = Account & Document;
export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.index({ userId: 1 });
AccountSchema.index({ providerId: 1, accountId: 1 }, { unique: true });
