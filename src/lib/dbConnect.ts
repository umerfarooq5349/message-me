/* eslint-disable @typescript-eslint/no-unused-vars */

import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connect: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connect.isConnected) {
    console.log("DB is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URI!);
    connect.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database connection failed ):", error);
    process.exit(1);
  }
}

export default dbConnect;
