import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, { message: "User name should be at leate 3 charecters" })
  .max(15, "User name should not be more then 15 charecters")
  .regex(/^[a-z0-9_-]+$/, "User name should only contain a-z, 0-9, _, or -");

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be 6 digit long" }),
});
