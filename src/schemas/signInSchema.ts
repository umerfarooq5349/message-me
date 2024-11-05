import { z } from "zod";

export const signinSchema = z.object({
  identifier: z.string(),
  password: z.string().length(8, { message: "Password must be 8 digit long" }),
});
