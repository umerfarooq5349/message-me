/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document, Model } from "mongoose";
import { Message, MessageSchema } from "./Message";

// Define the User interface
export interface User extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
  authType: string;
  profilePic: string;
  resetTokenExpiry: Date;
  resetToken: string;
}

// Define the User schema
const UserSchema = new Schema<User>({
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
    required: function (this: User) {
      return this.authType === "credentials";
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  profilePic: {
    type: String,
  },
  authType: {
    type: String,
    required: [true, "Auth type is required"],
    enum: ["credentials", "google", "instagram", "facebook"],
  },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
  resetToken: { type: String, default: undefined },
  resetTokenExpiry: { type: Date, default: Date.now() },
});

// Create the User model
export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);
