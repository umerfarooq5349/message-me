import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // generate 6 digit random number
    const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
    // add 30 minutes from now own for verify code validity
    const verifyCodeExpiryTime = new Date();
    verifyCodeExpiryTime.setMinutes(verifyCodeExpiryTime.getMinutes() + 30);
    // check user is verified with username and email
    const exitingUserByUserName = await UserModel.findOne({
      userName,
      isAcceptingMessage: true,
    });
    if (exitingUserByUserName) {
      return Response.json(
        {
          statue: false,
          message: "User name is not available):",
        },
        { status: 403 }
      );
    }

    // check user by email
    const existingUserWithEmail = await UserModel.findOne({ email });
    if (existingUserWithEmail) {
      if (existingUserWithEmail.isverified) {
        return Response.json(
          {
            statue: false,
            message: "Email already exists):",
          },
          { status: 403 }
        );
      }

      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiryTime;
      await existingUserWithEmail.save();
    } else {
      //new user
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        verifyCodeExpiry: verifyCodeExpiryTime,
        verifyCode,
      });

      await newUser.save();
    }
    await sendVerificationEmail(userName, verifyCode, email);
  } catch (error) {
    console.error("Signup failed): ", error);
    return Response.json(
      {
        statue: false,
        message: "Signup failed):",
      },
      { status: 500 }
    );
  }
}
