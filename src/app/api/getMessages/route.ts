import { auth } from "@/auth";

import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/Message";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();
    await dbConnect();

    if (!session || !session.user) {
      return sendResponce(false, "User is not authenticated", 401);
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return sendResponce(false, "User not found", 404);
    }

    // Return all messages under 'data' key
    return sendResponce(true, "Here are the messages", 200, user[0]);
  } catch (error) {
    return sendResponce(false, "Message not found", 500, error);
  }
}
