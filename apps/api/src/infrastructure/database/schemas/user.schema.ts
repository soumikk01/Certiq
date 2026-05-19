import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  _id!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ default: null })
  name!: string | null;

  @Prop({ default: null })
  avatarUrl!: string | null;

  @Prop({ default: false })
  emailVerified!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
