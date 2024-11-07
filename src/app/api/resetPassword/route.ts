import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/user";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  const { resetToken, data } = await request.json();

  try {
    // Decode and verify the reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!); // Use jwt.verify for validation

    const userId = (decoded as { userId: string }).userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return sendResponce(false, "Wrong email or user name", 404);
    }

    if (data) {
      const hashedPassword = await bcrypt.hash(data.password, 12);
      user.password = hashedPassword;

      await user.save();
      return sendResponce(true, "password changed", 201, user);
    }

    return sendResponce(true, "Reset link received and verified", 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return sendResponce(false, "Reset link has been expired", 401, error);
      }
      return sendResponce(false, "Invalid or expired reset link", 400, error);
    }
  }
};
