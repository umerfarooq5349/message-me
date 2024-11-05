import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { UserModel } from "@/models/user";
import { sendResponce } from "@/lib/sendResponce";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userName, email, password } = await request.json();

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
      return sendResponce(false, "Username is not available.", 403);
    }

    // Check if user already exists by email
    const existingUserWithEmail = await UserModel.findOne({ email });
    if (existingUserWithEmail) {
      // If user is already verified
      if (existingUserWithEmail.isVerified) {
        return sendResponce(false, "Email already exists.", 403);
      }
      // email exist but not verified
      // Update existing user's details
      existingUserWithEmail.userName = userName;
      existingUserWithEmail.password = hashedPassword;
      existingUserWithEmail.verifyCode = verifyCode;
      existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiryTime;
      existingUserWithEmail.authType = "credentials";
      await existingUserWithEmail.save();
      // Send verification email
      try {
        await sendVerificationEmail(userName, verifyCode, email);
        return sendResponce(true, "Please verify your email.", 201);
      } catch (error) {
        return sendResponce(
          true,
          "Unable to send verification email.",
          403,
          error
        );
      }
    } else {
      // Create a new user
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        verifyCodeExpiry: verifyCodeExpiryTime,
        verifyCode,
        authType: "credentials",
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
      return sendResponce(
        true,
        "Signup successful! Please verify your email.",
        201
      );
    }
  } catch (error) {
    console.error("Signup failed:", error);
    return sendResponce(false, "Signup failed due to an internal error.", 500);
  }
}
