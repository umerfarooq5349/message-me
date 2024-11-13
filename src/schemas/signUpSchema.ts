import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters." })
  .max(15, { message: "Username must be no more than 15 characters." })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: "Username can only contain letters, numbers",
  });

export const signUpSchema = z.object({
  userName: userNameValidation,
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be 6 digit long" }),
});
