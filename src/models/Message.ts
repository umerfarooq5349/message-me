/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});
