import { z } from "zod";

export const signinSchema = z.object({
  identifier: z.string().email(),
  password: z.string().min(6, { message: "Password must be 6 digit long" }),
});
