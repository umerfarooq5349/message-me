/* eslint-disable @typescript-eslint/no-unused-vars */
import VerificationEmail from "@/emails/verificationEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import emailJs from "@emailjs/browser";
import toast from "react-hot-toast";

export async function sendVerificationEmail(
  userName: string,
  verifyCode: string,
  email: string
): Promise<ApiResponse> {
  try {
    console.log("im here");
    // await emailJs.send(
    //   process.env.NEXT_EMAILJS_SERVICE_ID!,
    //   process.env.NEXT_EMAILJS_TEMPLATE_ID!,
    //   { verifyCode, email },
    //   process.env.NEXT_EMAILJS_PUBLIC_KEY
    // );
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Message Me | Verification code",
      react: VerificationEmail(userName, verifyCode),
    });
    return {
      status: true,
      message: "Verification emaiii\n\n\nil sent successfully (:",
    };
  } catch (sendingEmailError) {
    console.error("Failed to send verification email ):", sendingEmailError);
    return { status: false, message: "Failed to send verification email ):" };
  }
}
