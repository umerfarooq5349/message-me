/* eslint-disable @typescript-eslint/no-unused-vars */
import { BlobOptions } from "buffer";
import mongoose, { Schema, Document } from "mongoose";
import { Message, MessageSchema } from "./Message";

export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isverified: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  userName: {
    type: String,
    required: [true, "User Name is required"],
    trim: true,
    unique: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  isverified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
