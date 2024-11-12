import { sendVerificationEmail } from "@/helpers/sendVerifyOrResetEmails";
import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { UserModel } from "@/models/Message";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { verifyCode } from "@/lib/verifyCode";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();
    const { identifier } = await request.json();
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return sendResponce(false, "Wrong email or user name", 404);
    }

    const resetToken = jwt.sign(
      { userId: user._id!.toString() },
      process.env.JWT_SECRET!,
      { algorithm: "HS256", expiresIn: "30m" } // Changed to synchronous
    );
    // const resetToken = await bcrypt.hash(user._id!.toString(), 12);
    // const updatedUser = await UserModel.findOneAndUpdate(
    //   user._id!,
    //   {
    //     resetToken,
    //     resetTokenExpiry,
    //   },
    //   { new: true }
    // );
    await sendVerificationEmail(
      identifier,
      verifyCode,
      user.email,
      "password reset",
      `resetToken=${resetToken}`
    );

    return sendResponce(true, "Password Reset email sent", 200);
  } catch (error) {
    return sendResponce(false, "Unable to verify user", 405, error);
  }
};
