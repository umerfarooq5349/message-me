/* eslint-disable @typescript-eslint/no-unused-vars */
// import PasswordResetEmailTemplate from "@/emails/passwordResetEmail";
import {
  VerificationEmailTemplate,
  PasswordResetEmailTemplate,
} from "@/emails/verificationEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
// import emailJs from "@emailjs/browser";
import { render } from "@react-email/components";

import nodemailer from "nodemailer";

import toast from "react-hot-toast";

export async function sendVerificationEmail(
  userName: string,
  verifyCode: string,
  email: string,
  emailType: string,
  url?: string
): Promise<ApiResponse> {
  try {
    console.log("im here");

    // Select the email template and subject based on emailType
    let emailTemplate, subject;
    if (emailType === "verification") {
      emailTemplate = VerificationEmailTemplate({
        userName,
        verifyCode,
      });
      subject = "Message Me | Verification Code";
    } else if (emailType === "password reset") {
      emailTemplate = PasswordResetEmailTemplate({
        userName,
        url: `https://be-anonymouse.vercel.app/resetPassword?${url}`,
      });
      subject = "Message Me | Password Reset Request";
    }

    // Render the chosen email template
    const html = await render(emailTemplate!);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: email,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: "Verification emaiii\n\n\nil sent successfully (:",
    };
  } catch (sendingEmailError) {
    console.error("Failed to send verification email ):", sendingEmailError);
    return { success: false, message: "Failed to send verification email ):" };
  }
}
