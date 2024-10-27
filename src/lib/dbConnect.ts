/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connect: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connect.isConnected) {
    console.log("DB is already connected");
    mongoose.set("debug", true);
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!);
    connect.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully!");
    mongoose.set("debug", true);
  } catch (error) {
    console.log("Database connection failed ):", error);
    process.exit(1);
  }
}

export default dbConnect;
