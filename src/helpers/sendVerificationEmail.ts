import VerificationEmail from "@/emails/verificationEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  userName: string,
  verifyCode: string,
  email: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Message Me | Verification code",
      react: VerificationEmail({ username: userName, verifyCode: verifyCode }),
    });
    return { status: true, message: "Verification email sent successfully (:" };
  } catch (sendingEmailError) {
    console.error("Failed to send verification email ):", sendingEmailError);
    return { status: false, message: "Failed to send verification email ):" };
  }
}
