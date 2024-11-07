// generate 6 digit random code

import { signIn } from "@/auth";

export const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
// add 30 minutes from now own for verify code validity
export const verifyCodeExpiryTime = new Date();
verifyCodeExpiryTime.setMinutes(verifyCodeExpiryTime.getMinutes() + 30);

export const resetTokenExpiry = new Date();
resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + 30);

export const handleSignOut = async () => {
  await signIn();
};
