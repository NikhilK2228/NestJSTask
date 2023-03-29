import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Document<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  emailid: string;

  @Prop()
  address: string;

  @Prop()
  password: string;

  // @Prop()
  // newpassword:string;

}

export const UserSchema = SchemaFactory.createForClass(User);