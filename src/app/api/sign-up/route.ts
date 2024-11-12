import { sendVerificationEmail } from "@/helpers/sendVerifyOrResetEmails";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { UserModel } from "@/models/Message";
import { sendResponce } from "@/lib/sendResponce";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiryTime = new Date();
    verifyCodeExpiryTime.setMinutes(verifyCodeExpiryTime.getMinutes() + 30);

    const existingUserByUserName = await UserModel.findOne({
      userName,
      isAcceptingMessage: { $ne: false },
    });
    if (existingUserByUserName) {
      return sendResponce(false, "Username is not available.", 403);
    }

    const existingUserWithEmail = await UserModel.findOne({ email });
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return sendResponce(false, "Email already exists.", 403);
      }
      existingUserWithEmail.userName = userName;
      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiryTime;
      existingUserWithEmail.authType = "credentials";
      await existingUserWithEmail.save();
    } else {
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        verifyCodeExpiry: verifyCodeExpiryTime,
        verifyCode,
        authType: "credentials",
        userName,
      });
      await newUser.save();
    }

    try {
      await sendVerificationEmail(userName, verifyCode, email, "verification");
      return sendResponce(
        true,
        "Signup successful! Please verify your email.",
        201
      );
    } catch (error) {
      console.error("Email sending failed:", error);
      return sendResponce(
        false,
        "Unable to send verifiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiication email.",
        403
      );
    }
  } catch (error) {
    console.error("Signup failed:", error);
    return sendResponce(false, "Signup failed due to an internal error.", 500);
  }
}
