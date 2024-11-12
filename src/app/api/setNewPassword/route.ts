import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/Message";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const { resetToken, data } = await request.json();
    console.log(data);
    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!);
    const userId = (decoded as { userId: string }).userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return sendResponce(false, "User not found", 404);
    }

    // Check if new password is provided
    if (data && data.password) {
      user.password = await bcrypt.hash(data.password, 12);
      await user.save();
      return sendResponce(true, "Password updated successfully", 201);
    }

    return sendResponce(false, "Unable to update password", 400);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponce(false, "Reset link expired", 401);
    }
    return sendResponce(false, "Invalid reset link", 400);
  }
};
