/* eslint-disable @typescript-eslint/no-unused-vars */
import VerificationEmail from "@/emails/verificationEmailTemplate";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
// import emailJs from "@emailjs/browser";
import { render } from "@react-email/components";

import nodemailer from "nodemailer";

import toast from "react-hot-toast";

export async function sendVerificationEmail(
  userName: string,
  verifyCode: string,
  email: string
): Promise<ApiResponse> {
  try {
    console.log("im here");

    //send email using node mailer....it needs client(browser) to send mails good but only for clients not work is servers

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

    // const html = renderToStaticMarkup(
    //   <VerificationEmail userName={userName} verifyCode={verifyCode} />
    // );

    const html = await render(VerificationEmail({ userName, verifyCode }));
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: email,
      subject: "Message Me | Verification code",
      html: html,
    };
    transporter.sendMail(mailOptions);
    //send email using emailjs....it needs client(browser) to send mails good but only for clients not work is servers

    // await emailJs.send(
    //   process.env.NEXT_EMAILJS_SERVICE_ID!,
    //   process.env.NEXT_EMAILJS_TEMPLATE_ID!,
    //   { verifyCode, email },
    //   process.env.NEXT_EMAILJS_PUBLIC_KEY
    // );

    //send email useing resend....it needs domain to send out to users

    // await resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: email,
    //   subject: "Message Me | Verification code",
    //   react: VerificationEmail(userName, verifyCode),
    // });
    return {
      success: true,
      message: "Verification emaiii\n\n\nil sent successfully (:",
    };
  } catch (sendingEmailError) {
    console.error("Failed to send verification email ):", sendingEmailError);
    return { success: false, message: "Failed to send verification email ):" };
  }
}
