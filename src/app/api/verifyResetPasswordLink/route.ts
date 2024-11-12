import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/Message";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { resetToken } = await request.json();

    // Decode and verify the reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!); // Use jwt.verify for validation

    const userId = (decoded as { userId: string }).userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return sendResponce(false, "Wrong email or user name", 404);
    }

    return sendResponce(true, "Now you can update your password", 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return sendResponce(false, "Reset link has been expired", 401, error);
      }
      return sendResponce(false, "Invalid or expired reset link", 400, error);
    }
  }
};
