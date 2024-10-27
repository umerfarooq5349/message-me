import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserModel } from "@/models/user";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userName, email, password, authType } = await request.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit random verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set verification code expiration time (30 minutes from now)
    const verifyCodeExpiryTime = new Date();
    verifyCodeExpiryTime.setMinutes(verifyCodeExpiryTime.getMinutes() + 30);

    // Check if username is already taken and user allows messaging
    const existingUserByUserName = await UserModel.findOne({
      userName,
      isAcceptingMessage: true,
    });
    if (existingUserByUserName) {
      return NextResponse.json(
        {
          status: false,
          message: "Username is not available.",
        },
        { status: 403 }
      );
    }

    // Check if user already exists by email
    const existingUserWithEmail = await UserModel.findOne({ email });
    if (existingUserWithEmail) {
      // If user is already verified
      if (existingUserWithEmail.isVerified) {
        return NextResponse.json(
          {
            status: false,
            message: "Email already exists.",
          },
          { status: 403 }
        );
      }

      // Update existing user's details
      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiryTime;
      existingUserWithEmail.authType = authType;
      await existingUserWithEmail.save();
      // Send verification email
      try {
        await sendVerificationEmail(userName, verifyCode, email);
        console.log(
          "Verification ekjfhiewewoid\n\n\n\nmail sent successfully."
        );
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }
    } else {
      // Create a new user
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        verifyCodeExpiry: verifyCodeExpiryTime,
        verifyCode,
        authType,
        userName,
      });
      await newUser.save();
      // Send verification email
      try {
        await sendVerificationEmail(userName, verifyCode, email);
        console.log("Verification email sent successfully.");
      } catch (error) {
        console.error("Failed to send verification email:", error);
      }

      // Respond with success message for new user
      return NextResponse.json(
        {
          status: true,
          message: "Signup successful! Please verify your email.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Signup failed:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Signup failed due to an internal error.",
      },
      { status: 500 }
    );
  }
}
